import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  HOST: z.string().default('localhost'),
  
  // API Keys for financial data
  ALPHA_VANTAGE_API_KEY: z.string().optional(),
  YAHOO_FINANCE_API_KEY: z.string().optional(),
  COINGECKO_API_KEY: z.string().optional(),
  
  // JWT Secret
  JWT_SECRET: z.string().default('your-super-secret-jwt-key-change-in-production'),
  
  // Rate limiting
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutes
  
  // Cache settings
  CACHE_TTL: z.string().transform(Number).default('300'), // 5 minutes
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

const env = envSchema.parse(process.env);

export default env; 