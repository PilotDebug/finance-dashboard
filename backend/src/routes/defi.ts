import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CoinGeckoService, MockDataService } from '../services/externalApis';
import { ResponseUtil } from '../utils/response';
import { DeFiToken, DeFiOpportunity } from '../types';

const defiService = new CoinGeckoService();

export default async function defiRoutes(fastify: FastifyInstance) {
  // Get single token price
  fastify.get('/token/:id', {}, async (request: FastifyRequest<{ Params: { id: string; vsCurrency?: string } }>, reply: FastifyReply) => {
    try {
      const { id, vsCurrency = 'usd' } = request.params;
      let token: DeFiToken | null;
      try {
        token = await defiService.getTokenPrice(id, vsCurrency);
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn(`API failed for ${id}, using mock data`);
        token = MockDataService.getMockDeFiToken(id);
      }
      if (!token) {
        return ResponseUtil.notFound(reply, `Token not found: ${id}`);
      }
      return ResponseUtil.success(reply, token, `Token data retrieved for ${id}`);
    } catch (error) {
      console.error('Error in GET /token/:id:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Get top tokens by market cap
  fastify.get('/tokens/top', {}, async (request: FastifyRequest<{ Querystring: { limit?: number; vsCurrency?: string } }>, reply: FastifyReply) => {
    try {
      const { limit = 100, vsCurrency = 'usd' } = request.query;
      let tokens: DeFiToken[];
      try {
        tokens = await defiService.getTopTokens(limit, vsCurrency);
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn('API failed for top tokens, using mock data');
        const mockIds = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'ripple', 'polkadot', 'dogecoin'];
        tokens = mockIds.slice(0, limit).map(id => MockDataService.getMockDeFiToken(id));
      }
      return ResponseUtil.success(reply, tokens, `Retrieved top ${tokens.length} tokens`);
    } catch (error) {
      console.error('Error in GET /tokens/top:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Get yield opportunities (mock implementation)
  fastify.get('/opportunities', {}, async (request: FastifyRequest<{ Querystring: { risk?: string; type?: string; limit?: number } }>, reply: FastifyReply) => {
    try {
      const { risk, type, limit = 20 } = request.query;
      const mockOpportunities: DeFiOpportunity[] = [
        {
          id: '1',
          protocol: 'Aave',
          token: 'USDC',
          apy: 4.2,
          tvl: 1500000000,
          risk: 'low',
          type: 'lending',
          description: 'Lend USDC on Aave protocol',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '2',
          protocol: 'Compound',
          token: 'DAI',
          apy: 3.8,
          tvl: 800000000,
          risk: 'low',
          type: 'lending',
          description: 'Lend DAI on Compound protocol',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '3',
          protocol: 'Uniswap',
          token: 'ETH/USDC',
          apy: 12.5,
          tvl: 2500000000,
          risk: 'medium',
          type: 'liquidity-pool',
          description: 'Provide liquidity for ETH/USDC pair',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '4',
          protocol: 'Curve',
          token: '3pool',
          apy: 8.1,
          tvl: 1800000000,
          risk: 'medium',
          type: 'liquidity-pool',
          description: 'Stablecoin pool with Curve',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '5',
          protocol: 'Yearn Finance',
          token: 'yUSDC',
          apy: 15.2,
          tvl: 500000000,
          risk: 'high',
          type: 'yield-farming',
          description: 'Automated yield optimization',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '6',
          protocol: 'Lido',
          token: 'stETH',
          apy: 5.8,
          tvl: 12000000000,
          risk: 'low',
          type: 'staking',
          description: 'Stake ETH for stETH rewards',
          lastUpdated: new Date().toISOString(),
        },
      ];
      let filteredOpportunities = mockOpportunities;
      if (risk) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.risk === risk);
      }
      if (type) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.type === type);
      }
      filteredOpportunities.sort((a, b) => b.apy - a.apy);
      return ResponseUtil.success(
        reply,
        filteredOpportunities.slice(0, limit),
        `Retrieved ${filteredOpportunities.length} DeFi opportunities`
      );
    } catch (error) {
      console.error('Error in GET /opportunities:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Get DeFi protocols (mock implementation)
  fastify.get('/protocols', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const protocols = [
        {
          name: 'Uniswap',
          category: 'DEX',
          tvl: 2500000000,
          volume24h: 1500000000,
          description: 'Decentralized exchange for ERC-20 tokens',
          website: 'https://uniswap.org',
        },
        {
          name: 'Aave',
          category: 'Lending',
          tvl: 1500000000,
          volume24h: 50000000,
          description: 'Decentralized lending and borrowing protocol',
          website: 'https://aave.com',
        },
        {
          name: 'Compound',
          category: 'Lending',
          tvl: 800000000,
          volume24h: 30000000,
          description: 'Algorithmic interest rate protocol',
          website: 'https://compound.finance',
        },
        {
          name: 'Curve',
          category: 'DEX',
          tvl: 1800000000,
          volume24h: 800000000,
          description: 'Efficient stablecoin trading',
          website: 'https://curve.fi',
        },
        {
          name: 'Yearn Finance',
          category: 'Yield Aggregator',
          tvl: 500000000,
          volume24h: 20000000,
          description: 'Automated yield farming strategies',
          website: 'https://yearn.finance',
        },
        {
          name: 'Lido',
          category: 'Staking',
          tvl: 12000000000,
          volume24h: 100000000,
          description: 'Liquid staking for Ethereum',
          website: 'https://lido.fi',
        },
      ];

      return ResponseUtil.success(reply, protocols, 'DeFi protocols retrieved successfully');
    } catch (error) {
      console.error('Error in GET /protocols:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Get market overview
  fastify.get('/market-overview', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const overview = {
        totalMarketCap: 2500000000000, // $2.5T
        totalVolume24h: 85000000000, // $85B
        bitcoinDominance: 48.5,
        ethereumDominance: 18.2,
        totalDefiTvl: 45000000000, // $45B
        fearGreedIndex: 65, // Greed
        marketSentiment: 'bullish',
        topGainers24h: [
          { symbol: 'SOL', change: 12.5 },
          { symbol: 'ADA', change: 8.3 },
          { symbol: 'DOT', change: 6.7 },
        ],
        topLosers24h: [
          { symbol: 'XRP', change: -5.2 },
          { symbol: 'LINK', change: -3.8 },
          { symbol: 'UNI', change: -2.1 },
        ],
        lastUpdated: new Date().toISOString(),
      };

      return ResponseUtil.success(reply, overview, 'Market overview retrieved successfully');
    } catch (error) {
      console.error('Error in GET /market-overview:', error);
      return ResponseUtil.internalError(reply);
    }
  });
} 