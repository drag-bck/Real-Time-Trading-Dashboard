export interface Ticker {
  symbol: string;
  name: string;
}

export interface Candle {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Tick {
  type: "tick";
  symbol: string;
  price: number;
  ts: number;
}
