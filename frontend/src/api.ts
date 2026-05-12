import type { Candle, Ticker } from "./types";

const API_URL = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:4000";
export const WS_URL = (import.meta.env.VITE_WS_URL as string) ?? "ws://localhost:4000/ws";

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function login(username: string, password: string): Promise<string> {
  const r = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!r.ok) throw new Error("Login failed");
  const { token } = await r.json();
  return token;
}

export async function fetchTickers(token: string): Promise<Ticker[]> {
  const r = await fetch(`${API_URL}/api/tickers`, { headers: authHeaders(token) });
  if (!r.ok) throw new Error("Failed to load tickers");
  return r.json();
}

export async function fetchHistory(token: string, symbol: string, days = 30): Promise<Candle[]> {
  const r = await fetch(`${API_URL}/api/tickers/${symbol}/history?days=${days}`, {
    headers: authHeaders(token),
  });
  if (!r.ok) throw new Error("Failed to load history");
  const { candles } = await r.json();
  return candles;
}
