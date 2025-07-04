const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error('Failed to fetch health');
  return res.json();
}

export async function fetchStocks() {
  const res = await fetch(`${API_BASE_URL}/stocks/watchlist`);
  if (!res.ok) throw new Error('Failed to fetch stocks');
  return res.json();
}

export async function fetchDeFi() {
  const res = await fetch(`${API_BASE_URL}/defi/opportunities`);
  if (!res.ok) throw new Error('Failed to fetch DeFi');
  return res.json();
}

export async function fetchPortfolio() {
  const res = await fetch(`${API_BASE_URL}/portfolio/1`);
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
} 