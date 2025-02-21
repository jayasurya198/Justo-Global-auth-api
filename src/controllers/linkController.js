const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../migration');
const jwt = require('jsonwebtoken');
const { LINK_EXPIRY, TOKEN_EXPIRY } = require('../config/settings');

exports.generateLink = (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = Date.now() + LINK_EXPIRY;

            db.run("INSERT INTO links (username, token, expires_at) VALUES (?, ?, ?)", [username, token, expiresAt], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error saving the link' });
                }

                res.json({ link: `http://localhost:3000/api/link/verify-link?token=${token}` });
            });
        });
    });
};

exports.verifyLink = (req, res) => {
    const { token } = req.query;

    db.get("SELECT * FROM links WHERE token = ?", [token], (err, link) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking the link' });
        }

        if (!link) {
            return res.status(400).json({ message: 'Invalid or expired link' });
        }

        if (Date.now() > link.expires_at) {
            return res.status(400).json({ message: 'Link has expired' });
        }

        const payload = { username: link.username };
        const jwtToken = jwt.sign(payload, 'secret_key', { expiresIn: TOKEN_EXPIRY });

        db.run("DELETE FROM links WHERE token = ?", [token]);

        res.json({ message: 'Link verified successfully', token: jwtToken });
    });
};
