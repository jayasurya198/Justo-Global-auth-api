const db = require('../migration');

exports.kickout = (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is requierd' });
    }

    db.run("DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE username = ?)", [username], function (err) {
        if (err) {
            console.error(`Errror while atempting to kickout user ${username}:`, err.message);
            return res.status(500).json({ message: 'Error ocurred while kicking out the user' });
        }
        res.json({ message: `User ${username} has been kicked out` });
    });
};
