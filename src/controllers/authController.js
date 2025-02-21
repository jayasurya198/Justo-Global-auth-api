const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../migration');
const { MAX_FAILED_ATTEMPTS, LOCK_TIME, TOKEN_EXPIRY } = require('../config/settings');

exports.login = (req, res) => {
    const { username, password } = req.body;
    
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (user.is_locked) {
            return res.status(403).json({ message: 'Account is locked. Try again later.' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!isMatch) {
                db.run("UPDATE users SET failed_attempts = failed_attempts + 1 WHERE username = ?", [username], (err) => {
                    if (err) {
                        console.error('Error updating failed attempts for user:', username, err);
                    }
                });

                if (user.failed_attempts + 1 >= MAX_FAILED_ATTEMPTS) {
                    console.log('Max failed attempts reached. Locking account for user:', username);
                    db.run("UPDATE users SET is_locked = 1 WHERE username = ?", [username], (err) => {
                        if (err) {
                            console.error('Error locking account for user:', username, err);
                        }
                    });

                    setTimeout(() => {
                        console.log('Unlocking account for user:', username);
                        db.run("UPDATE users SET is_locked = 0, failed_attempts = 0 WHERE username = ?", [username], (err) => {
                            if (err) {
                                console.error('Error resetting lock status for user:', username, err);
                            }
                        });
                    }, LOCK_TIME);
                }

                return res.status(401).json({ message: 'Invalid username or password' });
            }


            db.run("UPDATE users SET failed_attempts = 0 WHERE username = ?", [username], (err) => {
                if (err) {
                    console.error('Error resetting failed attempts for user:', username, err);
                }
            });

            const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: TOKEN_EXPIRY });
            return res.json({ token });
        });
    });
};
