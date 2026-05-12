import { EventEmitter } from "events";
import { TICKERS, TickerMeta } from "./tickers";

export interface Tick {
  symbol: string;
  price: number;
  ts: number;
}

/**
 * Geometric Brownian Motion price simulator.
 * dS = mu*S*dt + sigma*S*dW
 */
export class MarketFeed extends EventEmitter {
  private prices = new Map<string, number>();
  private timer?: NodeJS.Timeout;

  constructor(
    private tickers: TickerMeta[] = TICKERS,
    private intervalMs = 1000,
  ) {
    super();
    tickers.forEach((t) => this.prices.set(t.symbol, t.basePrice));
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.step(), this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  getPrice(symbol: string) {
    return this.prices.get(symbol);
  }

  /** Advance every ticker one step and emit ticks. Exposed for testing. */
  step(): Tick[] {
    const dt = this.intervalMs / 1000 / (252 * 6.5 * 3600); // years per step
    const ticks: Tick[] = [];
    for (const t of this.tickers) {
      const s = this.prices.get(t.symbol)!;
      const z = gaussian();
      const next = Math.max(
        0.01,
        s * Math.exp((t.drift - 0.5 * t.volatility ** 2) * dt + t.volatility * Math.sqrt(dt) * z),
      );
      this.prices.set(t.symbol, next);
      const tick: Tick = { symbol: t.symbol, price: round(next), ts: Date.now() };
      ticks.push(tick);
      this.emit("tick", tick);
    }
    return ticks;
  }
}

function gaussian() {
  // Box–Muller
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
