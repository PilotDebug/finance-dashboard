import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema } from 'zod';
import { ResponseUtil } from '../utils/response';

export function validateRequest<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = schema.safeParse(request.body);
      if (!result.success) {
        return ResponseUtil.badRequest(reply, 'Invalid request data', result.error.issues);
      }
      request.body = result.data;
    } catch (error) {
      return ResponseUtil.badRequest(reply, 'Request validation failed');
    }
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = schema.safeParse(request.params);
      if (!result.success) {
        return ResponseUtil.badRequest(reply, 'Invalid parameters', result.error.issues);
      }
      request.params = result.data;
    } catch (error) {
      return ResponseUtil.badRequest(reply, 'Parameter validation failed');
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = schema.safeParse(request.query);
      if (!result.success) {
        return ResponseUtil.badRequest(reply, 'Invalid query parameters', result.error.issues);
      }
      request.query = result.data;
    } catch (error) {
      return ResponseUtil.badRequest(reply, 'Query validation failed');
    }
  };
}