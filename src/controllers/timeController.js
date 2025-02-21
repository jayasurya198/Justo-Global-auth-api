const jwt = require('jsonwebtoken');
const db = require('../migration');

exports.getTime = (req, res) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, token is required' });
    }

    try {
        const decoded = jwt.verify(token, 'secret_key');
        
        if (!decoded.username) {
            return res.status(401).json({ message: 'Unauthorized, invalid token structure' });
        }

        db.get("SELECT * FROM users WHERE username = ?", [decoded.username], (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Error checking the user in the database' });
            }

            if (!user) {
                return res.status(404).json({ message: 'User not found in the database' });
            }

            return res.json({ 
                message: 'Token is valid and user authenticated',
                time: new Date().toISOString(),
                user: decoded.username
            });
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
