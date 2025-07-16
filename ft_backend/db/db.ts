
import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS friends (
  user_id INTEGER NOT NULL,
  friend TEXT NOT NULL,
  status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS PongHistory (
  user_id INTEGER NOT NULL,
  played INTEGER,
  wins INTEGER,
  scored INTEGER
  );

  CREATE TABLE IF NOT EXISTS RowHistory (
  user_id INTEGER NOT NULL,
  played INTEGER,
  YellowWins INTEGER,
  RedWins INTEGER
  )
`);

export default db;
