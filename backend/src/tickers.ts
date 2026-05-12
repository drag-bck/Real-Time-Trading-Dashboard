export interface TickerMeta {
  symbol: string;
  name: string;
  basePrice: number;
  volatility: number; // annualised sigma
  drift: number;     // annualised mu
}

export const TICKERS: TickerMeta[] = [
  { symbol: "AAPL",    name: "Apple Inc.",        basePrice: 195.4, volatility: 0.25, drift: 0.08 },
  { symbol: "TSLA",    name: "Tesla, Inc.",       basePrice: 248.1, volatility: 0.55, drift: 0.10 },
  { symbol: "MSFT",    name: "Microsoft Corp.",   basePrice: 415.3, volatility: 0.22, drift: 0.09 },
  { symbol: "NVDA",    name: "NVIDIA Corp.",      basePrice: 880.7, volatility: 0.50, drift: 0.20 },
  { symbol: "BTC-USD", name: "Bitcoin",           basePrice: 67250,  volatility: 0.70, drift: 0.15 },
  { symbol: "ETH-USD", name: "Ethereum",          basePrice: 3320,   volatility: 0.75, drift: 0.12 },
];

export const findTicker = (symbol: string) =>
  TICKERS.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase());
