import { useEffect, useState } from "react";
import { fetchTickers, WS_URL } from "./api";
import { useStore } from "./store";
import type { Ticker } from "./types";
import Login from "./components/Login";
import Header from "./components/Header";
import TickerList from "./components/TickerList";
import PriceChart from "./components/PriceChart";

export default function App() {
  const { token, applyTick, selected, select } = useStore();
  const [tickers, setTickers] = useState<Ticker[]>([]);

  useEffect(() => {
    if (!token) return;
    fetchTickers(token).then((ts) => {
      setTickers(ts);
      if (ts.length && !selected) select(ts[0].symbol);
    });
  }, [token]);

  // WebSocket lifecycle.
  useEffect(() => {
    if (!token || tickers.length === 0) return;
    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ action: "subscribe", symbols: tickers.map((t) => t.symbol) }));
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "tick") applyTick(msg);
      } catch { /* noop */ }
    };
    return () => ws.close();
  }, [token, tickers]);

  if (!token) return <Login />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <aside>
          <h2 className="text-xs uppercase tracking-wider text-muted mb-3">Watchlist</h2>
          <TickerList tickers={tickers} />
        </aside>
        <section>
          {selected ? <PriceChart symbol={selected} /> : (
            <div className="h-96 flex items-center justify-center text-muted">Select a ticker</div>
          )}
        </section>
      </main>
    </div>
  );
}
