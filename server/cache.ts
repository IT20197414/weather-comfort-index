import { CacheEntry, CacheStats } from './types';

export class MemoryCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private hits: number = 0;
  private misses: number = 0;
  private defaultTtlMs: number;
  private name: string;

  constructor(name: string, defaultTtlSeconds: number = 300) {
    this.name = name;
    this.defaultTtlMs = defaultTtlSeconds * 1000;
  }

  public get(key: string): { data: T | null; status: 'HIT' | 'MISS' } {
    const entry = this.cache.get(key);
    const now = Date.now();

    if (!entry) {
      this.misses++;
      return { data: null, status: 'MISS' };
    }

    if (now - entry.timestamp > entry.ttlMs) {
      // Expired entry
      this.cache.delete(key);
      this.misses++;
      return { data: null, status: 'MISS' };
    }

    this.hits++;
    return { data: entry.data, status: 'HIT' };
  }

  public set(key: string, data: T, ttlMs?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs: ttlMs || this.defaultTtlMs,
      key,
    });
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public getStats() {
    const now = Date.now();
    const activeKeys: Array<{ key: string; ageSeconds: number; ttlRemainingSeconds: number }> = [];

    // Clean expired and collect active
    for (const [key, entry] of this.cache.entries()) {
      const ageMs = now - entry.timestamp;
      if (ageMs > entry.ttlMs) {
        this.cache.delete(key);
      } else {
        activeKeys.push({
          key,
          ageSeconds: Math.round(ageMs / 1000),
          ttlRemainingSeconds: Math.max(0, Math.round((entry.ttlMs - ageMs) / 1000)),
        });
      }
    }

    const totalRequests = this.hits + this.misses;
    const hitRatio = totalRequests > 0 ? Math.round((this.hits / totalRequests) * 1000) / 10 : 0;

    return {
      name: this.name,
      totalEntries: activeKeys.length,
      hits: this.hits,
      misses: this.misses,
      hitRatio,
      keys: activeKeys,
    };
  }

  public resetCounters(): void {
    this.hits = 0;
    this.misses = 0;
  }
}

// Global cache singletons
export const rawWeatherCache = new MemoryCache<any>('RawWeatherCache', 300); // 5 minutes TTL
export const processedWeatherCache = new MemoryCache<any>('ProcessedWeatherCache', 300); // 5 minutes TTL

export function getFullCacheTelemetry(): CacheStats {
  const rawStats = rawWeatherCache.getStats();
  const processedStats = processedWeatherCache.getStats();
  const totalReq = rawStats.hits + rawStats.misses + processedStats.hits + processedStats.misses;

  return {
    rawCache: rawStats,
    processedCache: {
      totalEntries: processedStats.totalEntries,
      hits: processedStats.hits,
      misses: processedStats.misses,
      hitRatio: processedStats.hitRatio,
      lastComputed: processedStats.totalEntries > 0 ? new Date().toISOString() : null,
    },
    totalRequests: totalReq,
    ttlSeconds: 300,
  };
}
