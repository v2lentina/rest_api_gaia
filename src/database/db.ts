import Database from "better-sqlite3";
import { config } from "../config";
import path from "path";
import fs from "fs";

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (db) {
    return db;
  }

  // Ensure data directory exists
  const dbDir = path.dirname(config.cache.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Create/open database
  db = new Database(config.cache.dbPath);

  // Enable WAL mode for better concurrency
  db.pragma("journal_mode = WAL");

  // Initialize schema
  initializeSchema(db);

  return db;
}

function initializeSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query_key TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_query_key ON cache(query_key);
    CREATE INDEX IF NOT EXISTS idx_expires_at ON cache(expires_at);
  `);
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Cleanup old cache entries
export function cleanupExpiredCache(): void {
  const database = getDatabase();
  const now = Date.now();

  const stmt = database.prepare("DELETE FROM cache WHERE expires_at < ?");
  const result = stmt.run(now);

  if (result.changes > 0) {
    console.log(`Cleaned up ${result.changes} expired cache entries`);
  }
}
