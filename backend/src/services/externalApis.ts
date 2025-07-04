import axios, { AxiosInstance } from 'axios';
import { StockQuote, DeFiToken, AlphaVantageQuote, CoinGeckoToken } from '../types';
import { CacheUtil } from '../utils/cache';
import env from '../config/env';

export class AlphaVantageService {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = env.ALPHA_VANTAGE_API_KEY || '';
    this.client = axios.create({
      baseURL: 'https://www.alphavantage.co/query',
      timeout: 10000,
    });
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    if (!this.apiKey) {
      throw new Error('Alpha Vantage API key not configured');
    }

    const cacheKey = CacheUtil.keys.stockQuote(symbol);
    
    return CacheUtil.getOrSetFinancialData(cacheKey, async () => {
      try {
        const response = await this.client.get('', {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: symbol.toUpperCase(),
            apikey: this.apiKey,
          },
        });

        const data = response.data as AlphaVantageQuote;
        
        if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
          return null;
        }

        const quote = data['Global Quote'];
        
        return {
          symbol: quote['01. symbol'],
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
          open: parseFloat(quote['02. open']),
          high: parseFloat(quote['03. high']),
          low: parseFloat(quote['04. low']),
          previousClose: parseFloat(quote['08. previous close']),
          marketCap: 0, // Alpha Vantage doesn't provide this in global quote
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        throw new Error(`Failed to fetch quote for ${symbol}`);
      }
    });
  }

  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes = await Promise.allSettled(
      symbols.map(symbol => this.getQuote(symbol))
    );

    return quotes
      .filter((result): result is PromiseFulfilledResult<StockQuote | null> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value as StockQuote);
  }
}

export class CoinGeckoService {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = env.COINGECKO_API_KEY || '';
    this.client = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3',
      timeout: 10000,
      headers: this.apiKey ? { 'X-CG-API-Key': this.apiKey } : {},
    });
  }

  async getTokenPrice(id: string, vsCurrency: string = 'usd'): Promise<DeFiToken | null> {
    const cacheKey = CacheUtil.keys.cryptoPrice(id);
    
    return CacheUtil.getOrSetFinancialData(cacheKey, async () => {
      try {
        const response = await this.client.get(`/simple/price`, {
          params: {
            ids: id,
            vs_currencies: vsCurrency,
            include_24hr_change: true,
            include_market_cap: true,
            include_24hr_vol: true,
          },
        });

        const data = response.data[id];
        if (!data) {
          return null;
        }

        return {
          id,
          symbol: id.toUpperCase(),
          name: id.charAt(0).toUpperCase() + id.slice(1),
          price: data[vsCurrency],
          priceChange24h: data[`${vsCurrency}_24h_change`] || 0,
          priceChangePercent24h: data[`${vsCurrency}_24h_change`] || 0,
          marketCap: data[`${vsCurrency}_market_cap`] || 0,
          volume24h: data[`${vsCurrency}_24h_vol`] || 0,
          circulatingSupply: 0, // Would need additional API call
          totalSupply: 0, // Would need additional API call
          rank: 0, // Would need additional API call
          lastUpdated: new Date().toISOString(),
        };
      } catch (error) {
        console.error(`Error fetching price for ${id}:`, error);
        throw new Error(`Failed to fetch price for ${id}`);
      }
    });
  }

  async getTopTokens(limit: number = 100, vsCurrency: string = 'usd'): Promise<DeFiToken[]> {
    const cacheKey = CacheUtil.generateKey('crypto', 'top', limit.toString());
    
    return CacheUtil.getOrSetFinancialData(cacheKey, async () => {
      try {
        const response = await this.client.get('/coins/markets', {
          params: {
            vs_currency: vsCurrency,
            order: 'market_cap_desc',
            per_page: limit,
            page: 1,
            sparkline: false,
            locale: 'en',
          },
        });

        return response.data.map((token: CoinGeckoToken) => ({
          id: token.id,
          symbol: token.symbol.toUpperCase(),
          name: token.name,
          price: token.current_price,
          priceChange24h: token.price_change_24h,
          priceChangePercent24h: token.price_change_percentage_24h,
          marketCap: token.market_cap,
          volume24h: token.total_volume,
          circulatingSupply: token.circulating_supply,
          totalSupply: token.total_supply,
          rank: token.market_cap_rank,
          lastUpdated: token.last_updated,
        }));
      } catch (error) {
        console.error('Error fetching top tokens:', error);
        throw new Error('Failed to fetch top tokens');
      }
    });
  }

  async getTokenDetails(id: string): Promise<CoinGeckoToken | null> {
    const cacheKey = CacheUtil.generateKey('crypto', 'details', id);
    
    return CacheUtil.getOrSetFinancialData(cacheKey, async () => {
      try {
        const response = await this.client.get(`/coins/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching details for ${id}:`, error);
        return null;
      }
    });
  }
}

// Mock data service for development when APIs are not available
export class MockDataService {
  static getMockStockQuote(symbol: string): StockQuote {
    const basePrice = 100 + Math.random() * 900;
    const change = (Math.random() - 0.5) * 20;
    
    return {
      symbol,
      price: basePrice,
      change,
      changePercent: (change / basePrice) * 100,
      volume: Math.floor(Math.random() * 1000000),
      open: basePrice - change * 0.5,
      high: basePrice + Math.abs(change),
      low: basePrice - Math.abs(change),
      previousClose: basePrice - change,
      marketCap: basePrice * 1000000,
      timestamp: new Date().toISOString(),
    };
  }

  static getMockDeFiToken(id: string): DeFiToken {
    const basePrice = 1 + Math.random() * 1000;
    const change = (Math.random() - 0.5) * 50;
    
    return {
      id,
      symbol: id.toUpperCase(),
      name: id.charAt(0).toUpperCase() + id.slice(1),
      price: basePrice,
      priceChange24h: change,
      priceChangePercent24h: (change / basePrice) * 100,
      marketCap: basePrice * 1000000,
      volume24h: basePrice * 100000,
      circulatingSupply: 1000000,
      totalSupply: 1000000,
      rank: Math.floor(Math.random() * 100),
      lastUpdated: new Date().toISOString(),
    };
  }
} 