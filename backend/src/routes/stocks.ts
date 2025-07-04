import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AlphaVantageService, MockDataService } from '../services/externalApis';
import { ResponseUtil } from '../utils/response';
import { StockQuote } from '../types';

const stocksService = new AlphaVantageService();

export default async function stocksRoutes(fastify: FastifyInstance) {
  // Get single stock quote
  fastify.get('/quote/:symbol', {
    schema: {
      tags: ['stocks'],
      description: 'Get stock quote for a specific symbol',
      params: {
        type: 'object',
        properties: {
          symbol: { type: 'string', pattern: '^[A-Z]{1,5}$' }
        },
        required: ['symbol']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Params: { symbol: string } }>, reply: FastifyReply) => {
    try {
      const { symbol } = request.params;
      let quote: StockQuote | null;
      try {
        quote = await stocksService.getQuote(symbol);
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn(`API failed for ${symbol}, using mock data`);
        quote = MockDataService.getMockStockQuote(symbol);
      }
      if (!quote) {
        return ResponseUtil.notFound(reply, `Stock quote not found for ${symbol}`);
      }
      return ResponseUtil.success(reply, quote, `Quote retrieved for ${symbol}`);
    } catch (error) {
      console.error('Error in GET /quote/:symbol:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Get multiple stock quotes
  fastify.post('/quotes', {
    schema: {
      tags: ['stocks'],
      description: 'Get stock quotes for multiple symbols',
      body: {
        type: 'object',
        properties: {
          symbols: { 
            type: 'array',
            items: { type: 'string', pattern: '^[A-Z]{1,5}$' },
            minItems: 1,
            maxItems: 10
          }
        },
        required: ['symbols']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
            message: { type: 'string' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: { symbols: string[] } }>, reply: FastifyReply) => {
    try {
      const { symbols } = request.body;
      let quotes: StockQuote[];
      try {
        quotes = await stocksService.getMultipleQuotes(symbols);
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn('API failed for multiple quotes, using mock data');
        quotes = symbols.map(symbol => MockDataService.getMockStockQuote(symbol));
      }
      return ResponseUtil.success(reply, quotes, `Retrieved quotes for ${quotes.length} symbols`);
    } catch (error) {
      console.error('Error in POST /quotes:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Get RKLB specific data
  fastify.get('/rklb', {}, async (request: FastifyRequest<{ Querystring: { includeHistory?: boolean } }>, reply: FastifyReply) => {
    try {
      const { includeHistory = false } = request.query;
      let rklbQuote: StockQuote;
      try {
        const quote = await stocksService.getQuote('RKLB');
        if (!quote) {
          throw new Error('RKLB quote not found');
        }
        rklbQuote = quote;
      } catch (error) {
        // Fallback to mock data
        console.warn('API failed for RKLB, using mock data');
        rklbQuote = MockDataService.getMockStockQuote('RKLB');
      }
      const rklbData = {
        quote: rklbQuote,
        company: {
          name: 'Rocket Lab USA, Inc.',
          sector: 'Aerospace & Defense',
          industry: 'Aerospace & Defense',
          description: 'Rocket Lab is a space company that provides launch services and space systems solutions.',
          website: 'https://www.rocketlabusa.com',
          employees: 1500,
          founded: 2006,
        },
        keyMetrics: {
          marketCap: rklbQuote.marketCap,
          peRatio: 15.2,
          priceToBook: 2.1,
          debtToEquity: 0.3,
          returnOnEquity: 0.08,
        },
        ...(includeHistory && {
          history: {
            daily: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              price: rklbQuote.price + (Math.random() - 0.5) * 10,
              volume: Math.floor(rklbQuote.volume * (0.8 + Math.random() * 0.4)),
            })),
          },
        }),
      };
      return ResponseUtil.success(reply, rklbData, 'RKLB data retrieved successfully');
    } catch (error) {
      console.error('Error in GET /rklb:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Get watchlist (mock implementation)
  fastify.get('/watchlist', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const watchlistSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'RKLB', 'NVDA', 'AMZN', 'META'];
      let watchlist: StockQuote[];
      try {
        watchlist = await stocksService.getMultipleQuotes(watchlistSymbols);
      } catch (error) {
        // Fallback to mock data
        console.warn('API failed for watchlist, using mock data');
        watchlist = watchlistSymbols.map(symbol => MockDataService.getMockStockQuote(symbol));
      }
      return ResponseUtil.success(reply, watchlist, 'Watchlist retrieved successfully');
    } catch (error) {
      console.error('Error in GET /watchlist:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Search stocks (mock implementation)
  fastify.get('/search', {
    schema: {
      tags: ['stocks'],
      description: 'Search stocks by symbol or name',
      querystring: {
        type: 'object',
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 50 },
          limit: { type: 'number', minimum: 1, maximum: 50, default: 10 }
        },
        required: ['query']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
            message: { type: 'string' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Querystring: { query: string; limit?: number } }>, reply: FastifyReply) => {
    try {
      const { query, limit = 10 } = request.query;
      const mockResults = [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
        { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Consumer Discretionary' },
        { symbol: 'RKLB', name: 'Rocket Lab USA, Inc.', sector: 'Aerospace & Defense' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
        { symbol: 'AMZN', name: 'Amazon.com, Inc.', sector: 'Consumer Discretionary' },
        { symbol: 'META', name: 'Meta Platforms, Inc.', sector: 'Technology' },
      ].filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
      return ResponseUtil.success(reply, mockResults, `Found ${mockResults.length} stocks matching "${query}"`);
    } catch (error) {
      console.error('Error in GET /search:', error);
      return ResponseUtil.internalError(reply);
    }
  });
} 