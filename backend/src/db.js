const Database = require('better-sqlite3');
const { create } = require('domain');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'database_files/db.sqlite');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

db.exec(`
    CREATE TABLE IF NOT EXISTS decks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deck_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        FOREIGN KEY (deck_id) REFERENCES decks (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS dungeons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dungeon_decks (
        dungeon_id INTEGER NOT NULL,
        deck_id INTEGER NOT NULL,
        FOREIGN KEY (dungeon_id) REFERENCES dungeons (id) ON DELETE CASCADE,
        FOREIGN KEY (deck_id) REFERENCES decks (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_levels (
        user_id TEXT NOT NULL PRIMARY KEY,
        level INTEGER NOT NULL
    )
`);

module.exports = db;