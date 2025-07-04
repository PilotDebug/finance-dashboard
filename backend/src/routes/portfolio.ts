import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ResponseUtil } from '../utils/response';
import { Portfolio, Holding, CreatePortfolioRequest, AddHoldingRequest } from '../types';

export default async function portfolioRoutes(fastify: FastifyInstance) {
  // Get user portfolio
  fastify.get('/:userId', {}, async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    try {
      const { userId: _userId } = request.params;
      
      // Mock portfolio data - in real implementation, this would come from database
      const mockHoldings: Holding[] = [
        {
          id: '1',
          symbol: 'AAPL',
          name: 'Apple Inc.',
          type: 'stock',
          quantity: 10,
          averagePrice: 150.00,
          currentPrice: 175.50,
          marketValue: 1755.00,
          costBasis: 1500.00,
          pnl: 255.00,
          pnlPercent: 17.0,
          weight: 35.2,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '2',
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          type: 'stock',
          quantity: 5,
          averagePrice: 2800.00,
          currentPrice: 2950.00,
          marketValue: 14750.00,
          costBasis: 14000.00,
          pnl: 750.00,
          pnlPercent: 5.36,
          weight: 29.6,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '3',
          symbol: 'RKLB',
          name: 'Rocket Lab USA, Inc.',
          type: 'stock',
          quantity: 100,
          averagePrice: 8.50,
          currentPrice: 9.25,
          marketValue: 925.00,
          costBasis: 850.00,
          pnl: 75.00,
          pnlPercent: 8.82,
          weight: 18.6,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '4',
          symbol: 'bitcoin',
          name: 'Bitcoin',
          type: 'crypto',
          quantity: 0.5,
          averagePrice: 45000.00,
          currentPrice: 52000.00,
          marketValue: 26000.00,
          costBasis: 22500.00,
          pnl: 3500.00,
          pnlPercent: 15.56,
          weight: 16.6,
          lastUpdated: new Date().toISOString(),
        },
      ];

      const totalValue = mockHoldings.reduce((sum, holding) => sum + holding.marketValue, 0);
      const totalCost = mockHoldings.reduce((sum, holding) => sum + holding.costBasis, 0);
      const totalPnL = totalValue - totalCost;
      const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

      // Update weights
      mockHoldings.forEach(holding => {
        holding.weight = totalValue > 0 ? (holding.marketValue / totalValue) * 100 : 0;
      });

      const portfolio: Portfolio = {
        id: 'portfolio-1',
        userId: _userId,
        name: 'Main Portfolio',
        totalValue,
        totalCost,
        totalPnL,
        totalPnLPercent,
        lastUpdated: new Date().toISOString(),
        holdings: mockHoldings,
      };

      return ResponseUtil.success(reply, portfolio, 'Portfolio retrieved successfully');
    } catch (error) {
      console.error('Error in GET /portfolio/:userId:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Create new portfolio
  fastify.post('/', {}, async (request: FastifyRequest<{ Body: CreatePortfolioRequest }>, reply: FastifyReply) => {
    try {
      const { name, description } = request.body;
      
      // Mock portfolio creation - in real implementation, this would save to database
      const newPortfolio = {
        id: `portfolio-${Date.now()}`,
        name,
        description: description || '',
        createdAt: new Date().toISOString(),
      };

      return ResponseUtil.success(reply, newPortfolio, 'Portfolio created successfully');
    } catch (error) {
      console.error('Error in POST /portfolio:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Add holding to portfolio
  fastify.post('/:portfolioId/holdings', {}, async (request: FastifyRequest<{ 
    Params: { portfolioId: string }; 
    Body: AddHoldingRequest 
  }>, reply: FastifyReply) => {
    try {
      const { portfolioId: _portfolioId } = request.params;
      const { symbol, quantity, price, date: _date } = request.body;
      
      // Mock holding creation - in real implementation, this would save to database
      const newHolding: Holding = {
        id: `holding-${Date.now()}`,
        symbol,
        name: symbol, // In real implementation, would fetch company name
        type: 'stock',
        quantity,
        averagePrice: price,
        currentPrice: price,
        marketValue: quantity * price,
        costBasis: quantity * price,
        pnl: 0,
        pnlPercent: 0,
        weight: 0, // Would be calculated based on total portfolio value
        lastUpdated: new Date().toISOString(),
      };

      return ResponseUtil.success(reply, newHolding, 'Holding added successfully', 201);
    } catch (error) {
      console.error('Error in POST /portfolio/:portfolioId/holdings:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Get portfolio performance
  fastify.get('/:userId/performance', {}, async (request: FastifyRequest<{ 
    Params: { userId: string }; 
    Querystring: { period: string } 
  }>, reply: FastifyReply) => {
    try {
      const { userId: _userId } = request.params;
      const { period } = request.query;
      
      // Mock performance data - in real implementation, this would calculate from historical data
      const performance = {
        period,
        totalReturn: 12.5,
        totalReturnPercent: 12.5,
        benchmarkReturn: 8.2, // S&P 500 equivalent
        benchmarkReturnPercent: 8.2,
        alpha: 4.3,
        beta: 1.1,
        sharpeRatio: 1.8,
        maxDrawdown: -5.2,
        volatility: 15.3,
        data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 2000,
          change: (Math.random() - 0.5) * 200,
        })),
      };

      return ResponseUtil.success(reply, performance, 'Performance data retrieved successfully');
    } catch (error) {
      console.error('Error in GET /portfolio/:userId/performance:', error);
      return ResponseUtil.internalError(reply);
    }
  });

  // Get portfolio allocation
  fastify.get('/:userId/allocation', {}, async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    try {
      const { userId: _userId } = request.params;
      
      // Mock allocation data
      const allocation = {
        byAssetType: [
          { type: 'Stocks', value: 35000, percentage: 70 },
          { type: 'Crypto', value: 10000, percentage: 20 },
          { type: 'Cash', value: 5000, percentage: 10 },
        ],
        bySector: [
          { sector: 'Technology', value: 25000, percentage: 50 },
          { sector: 'Aerospace & Defense', value: 5000, percentage: 10 },
          { sector: 'Cryptocurrency', value: 10000, percentage: 20 },
          { sector: 'Cash', value: 5000, percentage: 10 },
          { sector: 'Other', value: 5000, percentage: 10 },
        ],
        byMarketCap: [
          { category: 'Large Cap', value: 30000, percentage: 60 },
          { category: 'Mid Cap', value: 10000, percentage: 20 },
          { category: 'Small Cap', value: 5000, percentage: 10 },
          { category: 'Crypto', value: 10000, percentage: 20 },
        ],
      };

      return ResponseUtil.success(reply, allocation, 'Allocation data retrieved successfully');
    } catch (error) {
      console.error('Error in GET /portfolio/:userId/allocation:', error);
      return ResponseUtil.internalError(reply);
    }
  });
} 