import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';

// Use a local file-based SQLite DB to make the project self-contained.
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbFile = path.join(dataDir, 'restaurant.sqlite');

const db = new sqlite3.Database(dbFile);
// Promisify needed methods
const runAsync = promisify(db.run.bind(db));
const allAsync = promisify(db.all.bind(db));
const getAsync = promisify(db.get.bind(db));

// Enable foreign keys
runAsync('PRAGMA foreign_keys = ON;').catch(() => {});

export default {
  // Mimic mysql2/promise `query` which returns [rows, fields]
  query: async (sql, params = []) => {
    const rows = await allAsync(sql, params);
    return [rows, undefined];
  },
  run: async (sql, params = []) => {
    return runAsync(sql, params);
  },
  get: async (sql, params = []) => {
    return getAsync(sql, params);
  },
  _raw: db
};
