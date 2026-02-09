import { getDatabase } from "../db";
import { CacheEntry } from "../../types";
import { config } from "../../config";

export class CacheModel {
  /**
   * Find a cache entry by query key
   */
  static findByQueryKey(queryKey: string): CacheEntry | null {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT id, query_key as queryKey, summary, created_at as createdAt, expires_at as expiresAt
      FROM cache
      WHERE query_key = ? AND expires_at > ?
    `);

    const now = Date.now();
    const row = stmt.get(queryKey, now) as CacheEntry | undefined;

    return row || null;
  }

  /**
   * Create or update a cache entry
   */
  static upsert(queryKey: string, summary: string): CacheEntry {
    const db = getDatabase();
    const now = Date.now();
    const expiresAt = now + config.cache.ttlSeconds * 1000;

    const stmt = db.prepare(`
      INSERT INTO cache (query_key, summary, created_at, expires_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(query_key) 
      DO UPDATE SET 
        summary = excluded.summary,
        created_at = excluded.created_at,
        expires_at = excluded.expires_at
    `);

    const result = stmt.run(queryKey, summary, now, expiresAt);

    return {
      id: result.lastInsertRowid as number,
      queryKey,
      summary,
      createdAt: now,
      expiresAt,
    };
  }

  /**
   * Delete a cache entry
   */
  static delete(queryKey: string): boolean {
    const db = getDatabase();
    const stmt = db.prepare("DELETE FROM cache WHERE query_key = ?");
    const result = stmt.run(queryKey);
    return result.changes > 0;
  }

  /**
   * Delete all expired entries
   */
  static deleteExpired(): number {
    const db = getDatabase();
    const now = Date.now();
    const stmt = db.prepare("DELETE FROM cache WHERE expires_at < ?");
    const result = stmt.run(now);
    return result.changes;
  }

  /**
   * Get all cache entries (for debugging)
   */
  static getAll(): CacheEntry[] {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT id, query_key as queryKey, summary, created_at as createdAt, expires_at as expiresAt
      FROM cache
      ORDER BY created_at DESC
    `);
    return stmt.all() as CacheEntry[];
  }
}
