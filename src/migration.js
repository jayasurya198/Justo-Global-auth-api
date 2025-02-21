const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Create Users Table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY, 
            username TEXT, 
            password TEXT, 
            failed_attempts INTEGER, 
            is_locked INTEGER
        )
    `);

    // Create Sessions Table
    db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY, 
            user_id INTEGER, 
            token TEXT
        )
    `);

    // Create Links Table
    db.run(`
        CREATE TABLE IF NOT EXISTS links (
            id INTEGER PRIMARY KEY, 
            username TEXT, 
            token TEXT, 
            expires_at INTEGER
        )
    `);

    // Insert Test User Data
    const password = 'password';
    const passwordHash = bcrypt.hashSync('password', 10); // You should hash the password here in production

    db.run(`
        INSERT INTO users (username, password, failed_attempts, is_locked) 
        VALUES (?, ?, ?, ?)
    `, ['user@example.com', passwordHash, 0, 0]);

    db.run(`
        INSERT INTO users (username, password, failed_attempts, is_locked) 
        VALUES (?, ?, ?, ?)
    `, ['admin@example.com', passwordHash, 0, 0]);

    console.log('Test data seeded into the database! and NOTE password:', password);

    // Fetch all users and log them
    db.all("SELECT * FROM users;", (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return;
        }
        console.log('Users in the database:', rows);
    });
});

module.exports = db;
