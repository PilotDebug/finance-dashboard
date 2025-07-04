// Base types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Portfolio types
export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  lastUpdated: string;
  holdings: Holding[];
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'etf' | 'bond';
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  pnl: number;
  pnlPercent: number;
  weight: number; // percentage of portfolio
  lastUpdated: string;
}

// Trading types
export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  fee: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  orderType: 'market' | 'limit' | 'stop' | 'stop-limit';
  limitPrice?: number;
  stopPrice?: number;
}

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  filledQuantity: number;
  price: number;
  orderType: 'market' | 'limit' | 'stop' | 'stop-limit';
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected';
  createdAt: string;
  updatedAt: string;
  limitPrice?: number;
  stopPrice?: number;
}

// Stock types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  dividend: number;
  dividendYield: number;
  high52Week: number;
  low52Week: number;
  lastUpdated: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  marketCap: number;
  timestamp: string;
}

// DeFi types
export interface DeFiToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  rank: number;
  lastUpdated: string;
}

export interface DeFiOpportunity {
  id: string;
  protocol: string;
  token: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  type: 'lending' | 'yield-farming' | 'liquidity-pool' | 'staking';
  description: string;
  lastUpdated: string;
}

// Banking types
export interface BankAccount {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  availableBalance: number;
  currency: string;
  institution: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee';
  amount: number;
  description: string;
  category: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
}

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    defaultView: string;
    widgets: string[];
  };
}

// API Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Request/Response types
export interface CreatePortfolioRequest {
  name: string;
  description?: string;
}

export interface AddHoldingRequest {
  symbol: string;
  quantity: number;
  price: number;
  date: string;
}

export interface PlaceOrderRequest {
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  orderType: 'market' | 'limit' | 'stop' | 'stop-limit';
  limitPrice?: number;
  stopPrice?: number;
}

export interface GetStocksRequest {
  symbols: string[];
}

export interface GetDeFiTokensRequest {
  ids?: string[];
  vsCurrency?: string;
  order?: string;
  perPage?: number;
  page?: number;
}

// WebSocket types
export interface WebSocketMessage {
  type: 'price_update' | 'trade_update' | 'order_update' | 'portfolio_update';
  data: Record<string, unknown>;
  timestamp: string;
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// External API types
export interface AlphaVantageQuote {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

export interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
} 