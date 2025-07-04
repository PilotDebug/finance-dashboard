import NodeCache from 'node-cache';
// import { CacheEntry } from '../types';

export class CacheUtil {
  private static cache = new NodeCache({
    stdTTL: 300, // 5 minutes default
    checkperiod: 60, // Check for expired keys every minute
    useClones: false, // Better performance
  });

  static set<T>(key: string, data: T, ttl: number = 300): boolean {
    return this.cache.set(key, data, ttl);
  }

  static get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  static has(key: string): boolean {
    return this.cache.has(key);
  }

  static delete(key: string): number {
    return this.cache.del(key);
  }

  static flush(): void {
    this.cache.flushAll();
  }

  static getStats() {
    return this.cache.getStats();
  }

  static getKeys(): string[] {
    return this.cache.keys();
  }

  // Cache with automatic key generation for API responses
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 300
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    try {
      const data = await fetchFn();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  }

  // Cache for financial data with shorter TTL
  static async getOrSetFinancialData<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 60 // 1 minute for financial data
  ): Promise<T> {
    return this.getOrSet(key, fetchFn, ttl);
  }

  // Cache for user data with longer TTL
  static async getOrSetUserData<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 900 // 15 minutes for user data
  ): Promise<T> {
    return this.getOrSet(key, fetchFn, ttl);
  }

  // Generate cache keys
  static generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(':')}`;
  }

  // Cache keys for different data types
  static keys = {
    stockQuote: (symbol: string) => this.generateKey('stock', 'quote', symbol),
    stockProfile: (symbol: string) => this.generateKey('stock', 'profile', symbol),
    cryptoPrice: (id: string) => this.generateKey('crypto', 'price', id),
    portfolio: (userId: string) => this.generateKey('portfolio', userId),
    user: (userId: string) => this.generateKey('user', userId),
    trades: (userId: string) => this.generateKey('trades', userId),
    orders: (userId: string) => this.generateKey('orders', userId),
  };
} 