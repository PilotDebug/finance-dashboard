import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import env from '../config/env';

export function setupErrorHandler(fastify: any) {
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
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

    // Handle authentication errors
    if (error.statusCode === 401) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
        timestamp: new Date().toISOString(),
      });
    }

    // Handle not found errors
    if (error.statusCode === 404) {
      return reply.status(404).send({
        success: false,
        error: 'Not Found',
        message: 'Resource not found',
        timestamp: new Date().toISOString(),
      });
    }

    // Default error response
    const statusCode = error.statusCode || 500;
    const message = env.NODE_ENV === 'development' ? error.message : 'Something went wrong';
    
    return reply.status(statusCode).send({
      success: false,
      error: 'Internal Server Error',
      message,
      timestamp: new Date().toISOString(),
    });
  });
}