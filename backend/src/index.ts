import Fastify from 'fastify';
import cors from '@fastify/cors';

import env from './config/env';
import stocksRoutes from './routes/stocks';
import defiRoutes from './routes/defi';
import portfolioRoutes from './routes/portfolio';

// Create Fastify instance
const fastify = Fastify({
  logger: env.NODE_ENV === 'development' ? {
    level: 'info',
  } : {
    level: 'warn',
  },
});

// Register plugins
async function registerPlugins() {
  // CORS
  await fastify.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  // Security headers - temporarily disabled due to version conflicts
  // await fastify.register(helmet, {
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       styleSrc: ["'self'", "'unsafe-inline'"],
  //       scriptSrc: ["'self'"],
  //       imgSrc: ["'self'", "data:", "https:"],
  //     },
  //   },
  // });

  // Rate limiting - temporarily disabled due to version conflicts
  // await fastify.register(rateLimit, {
  //   max: env.RATE_LIMIT_MAX,
  //   timeWindow: env.RATE_LIMIT_WINDOW_MS,
  //   errorResponseBuilder: (_request, context) => ({
  //     success: false,
  //     error: 'Too many requests',
  //     message: `Rate limit exceeded, retry in ${Math.ceil(context.ttl / 1000)} seconds`,
  //     timestamp: new Date().toISOString(),
  //   }),
  // });

  // Swagger documentation - temporarily disabled due to version conflicts
  // await fastify.register(swagger, {
  //   swagger: {
  //     info: {
  //       title: 'PilotDebug Financial Dashboard API',
  //       description: 'API for financial dashboard with portfolio, trading, stocks, DeFi, and banking data',
  //       version: '1.0.0',
  //       contact: {
  //         name: 'PilotDebug',
  //         url: 'https://github.com/PilotDebug/finance-dashboard',
  //       },
  //     },
  //     host: `${env.HOST}:${env.PORT}`,
  //     schemes: ['http', 'https'],
  //     consumes: ['application/json'],
  //     produces: ['application/json'],
  //     tags: [
  //       { name: 'health', description: 'Health check endpoints' },
  //       { name: 'stocks', description: 'Stock market data endpoints' },
  //       { name: 'defi', description: 'DeFi and cryptocurrency endpoints' },
  //       { name: 'portfolio', description: 'Portfolio management endpoints' },
  //       { name: 'trading', description: 'Trading activity endpoints' },
  //       { name: 'banking', description: 'Banking and account endpoints' },
  //     ],
  //   },
  // });

  // await fastify.register(swaggerUi, {
  //   routePrefix: '/docs',
  //   uiConfig: {
  //     docExpansion: 'list',
  //     deepLinking: true,
  //   },
  //   staticCSP: true,
  // });
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/api/health', {
    schema: {
      tags: ['health'],
      description: 'Health check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                timestamp: { type: 'string' },
                uptime: { type: 'number' },
                environment: { type: 'string' },
              },
            },
            timestamp: { type: 'string' },
          },
        },
      },
    },
  }, async (_request, _reply) => {
    return {
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
      },
      timestamp: new Date().toISOString(),
    };
  });

  // API info
  fastify.get('/api', {
    schema: {
      tags: ['health'],
      description: 'API information',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                version: { type: 'string' },
                description: { type: 'string' },
                endpoints: {
                  type: 'object',
                  properties: {
                    health: { type: 'string' },
                    stocks: { type: 'string' },
                    defi: { type: 'string' },
                    docs: { type: 'string' },
                  },
                },
              },
            },
            timestamp: { type: 'string' },
          },
        },
      },
    },
  }, async (_request, _reply) => {
    return {
      success: true,
      data: {
        name: 'PilotDebug Financial Dashboard API',
        version: '1.0.0',
        description: 'Comprehensive financial data API for portfolio management, trading, stocks, DeFi, and banking',
        endpoints: {
          health: '/api/health',
          stocks: '/api/stocks',
          defi: '/api/defi',
          docs: '/docs',
        },
      },
      timestamp: new Date().toISOString(),
    };
  });

  // Register route modules
  await fastify.register(stocksRoutes, { prefix: '/api/stocks' });
  await fastify.register(defiRoutes, { prefix: '/api/defi' });
  await fastify.register(portfolioRoutes, { prefix: '/api/portfolio' });

  // 404 handler
  fastify.setNotFoundHandler(async (request, reply) => {
    return reply.status(404).send({
      success: false,
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
      timestamp: new Date().toISOString(),
    });
  });

  // Global error handler
  fastify.setErrorHandler((error, _request, reply) => {
    fastify.log.error(error);
    
    // Handle validation errors
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: 'Validation Error',
        message: 'Request validation failed',
        details: error.validation,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle rate limit errors
    if (error.statusCode === 429) {
      return reply.status(429).send({
        success: false,
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        timestamp: new Date().toISOString(),
      });
    }

    // Default error response
    return reply.status(error.statusCode || 500).send({
      success: false,
      error: 'Internal Server Error',
      message: env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      timestamp: new Date().toISOString(),
    });
  });
}

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    await fastify.listen({
      port: env.PORT,
      host: env.HOST,
    });

    fastify.log.info(`🚀 Server running on http://${env.HOST}:${env.PORT}`);
    fastify.log.info(`📚 API Documentation available at http://${env.HOST}:${env.PORT}/docs`);
    fastify.log.info(`🔍 Health check available at http://${env.HOST}:${env.PORT}/api/health`);
    
    // Log environment info
    fastify.log.info(`Environment: ${env.NODE_ENV}`);
    fastify.log.info(`CORS Origin: ${env.CORS_ORIGIN}`);
    fastify.log.info(`Rate Limit: ${env.RATE_LIMIT_MAX} requests per ${env.RATE_LIMIT_WINDOW_MS / 1000}s`);
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  fastify.log.info('Received SIGINT, shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  fastify.log.info('Received SIGTERM, shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

// Start the server
start();
