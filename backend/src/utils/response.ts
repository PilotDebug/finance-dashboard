import { FastifyReply } from 'fastify';
import { ApiResponse, ApiError } from '../types';

export class ResponseUtil {
  static success<T>(reply: FastifyReply, data: T, message?: string, statusCode: number = 200): FastifyReply {
    const response: ApiResponse<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      ...(message && { message }),
    };
    
    return reply.status(statusCode).send(response);
  }

  static error(reply: FastifyReply, error: string | ApiError, statusCode: number = 400): FastifyReply {
    const response: ApiResponse = {
      success: false,
      error: typeof error === 'string' ? error : error.message,
      timestamp: new Date().toISOString(),
    };
    
    return reply.status(statusCode).send(response);
  }

  static notFound(reply: FastifyReply, message: string = 'Resource not found'): FastifyReply {
    return this.error(reply, message, 404);
  }

  static unauthorized(reply: FastifyReply, message: string = 'Unauthorized'): FastifyReply {
    return this.error(reply, message, 401);
  }

  static forbidden(reply: FastifyReply, message: string = 'Forbidden'): FastifyReply {
    return this.error(reply, message, 403);
  }

  static internalError(reply: FastifyReply, message: string = 'Internal server error'): FastifyReply {
    return this.error(reply, message, 500);
  }

  static badRequest(reply: FastifyReply, message: string = 'Bad request'): FastifyReply {
    return this.error(reply, message, 400);
  }

  static validationError(reply: FastifyReply, _details: any): FastifyReply {
    const response: ApiResponse = {
      success: false,
      error: 'Validation error',
      message: 'Request validation failed',
      timestamp: new Date().toISOString(),
    };
    
    return reply.status(400).send(response);
  }
}

export class ApiErrorUtil {
  static create(code: string, message: string, details?: any): ApiError {
    return {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  static notFound(resource: string): ApiError {
    return this.create('NOT_FOUND', `${resource} not found`);
  }

  static unauthorized(): ApiError {
    return this.create('UNAUTHORIZED', 'Authentication required');
  }

  static forbidden(): ApiError {
    return this.create('FORBIDDEN', 'Access denied');
  }

  static validationError(details: any): ApiError {
    return this.create('VALIDATION_ERROR', 'Request validation failed', details);
  }

  static internalError(): ApiError {
    return this.create('INTERNAL_ERROR', 'Internal server error');
  }

  static externalApiError(service: string): ApiError {
    return this.create('EXTERNAL_API_ERROR', `Error fetching data from ${service}`);
  }
} 