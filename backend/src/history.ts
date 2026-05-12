import { LRUCache } from "lru-cache";
import { TickerMeta, findTicker } from "./tickers";

export interface Candle {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const cache = new LRUCache({
  maxSize: 500,
});

/** Deterministic mock OHLC for the last `days` days, cached per (symbol|day). */
export function getHistory(symbol: string, days = 30): Candle[] | null {
  const t = findTicker(symbol);
  if (!t) return null;

  const today = Math.floor(Date.now() / 86_400_000);
  const key = `${symbol}|${today}|${days}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const candles = generate(t, days, today);
  cache.set(key, candles);
  return candles;
}

function generate(t: TickerMeta, days: number, today: number): Candle[] {
  const candles: Candle[] = [];
  let price = t.basePrice;
  const seedBase = hash(t.symbol);
  for (let i = days - 1; i >= 0; i--) {
    const day = today - i;
    const rnd = mulberry32(seedBase ^ day);
    const open = price;
    const close = open * (1 + (rnd() - 0.5) * t.volatility * 0.1);
    const high = Math.max(open, close) * (1 + rnd() * t.volatility * 0.03);
    const low = Math.min(open, close) * (1 - rnd() * t.volatility * 0.03);
    candles.push({
      t: day * 86_400_000,
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
    });
    price = close;
  }
  return candles;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export const _cache = cache;
