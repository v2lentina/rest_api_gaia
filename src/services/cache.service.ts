import { CacheModel } from "../database/models/cache.model";
import { CacheEntry } from "../types/api";

export class CacheService {
  /**
   * Get cached summary by query key
   * Returns null if not found or expired
   */
  get(queryKey: string): string | null {
    const entry = CacheModel.findByQueryKey(queryKey);
    return entry ? entry.summary : null;
  }

  /**
   * Store a summary in cache
   */
  set(queryKey: string, summary: string): void {
    CacheModel.upsert(queryKey, summary);
  }

  /**
   * Check if a query is cached and fresh
   */
  has(queryKey: string): boolean {
    const entry = CacheModel.findByQueryKey(queryKey);
    return entry !== null;
  }

  /**
   * Delete a specific cache entry
   */
  delete(queryKey: string): boolean {
    return CacheModel.delete(queryKey);
  }

  /**
   * Clean up all expired cache entries
   */
  cleanup(): number {
    return CacheModel.deleteExpired();
  }

  /**
   * Get all cache entries (for debugging/admin)
   */
  getAll(): CacheEntry[] {
    return CacheModel.getAll();
  }

  /**
   * Generate a cache key from query
   * Normalize query to ensure consistent keys
   */
  generateKey(query: string): string {
    return query.trim().toLowerCase();
  }
}
