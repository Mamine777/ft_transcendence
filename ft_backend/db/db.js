"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const dbPath = path_1.default.join(__dirname, 'database.db');
const db = new better_sqlite3_1.default(dbPath);
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
exports.default = db;
