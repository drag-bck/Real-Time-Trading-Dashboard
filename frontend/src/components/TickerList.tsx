import { useStore } from "../store";
import type { Ticker } from "../types";

export default function TickerList({ tickers }: { tickers: Ticker[] }) {
  const { prices, selected, select } = useStore();
  return (
    <ul className="divide-y divide-line bg-surface border border-line rounded-xl overflow-hidden">
      {tickers.map((t) => {
        const p = prices[t.symbol];
        const dir = p ? (p.price >= p.prev ? "up" : "down") : null;
        const isSel = selected === t.symbol;
        return (
          <li key={t.symbol}>
            <button
              onClick={() => select(t.symbol)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition ${
                isSel ? "bg-bg" : "hover:bg-bg"
              }`}
            >
              <div>
                <div className="font-mono font-semibold">{t.symbol}</div>
                <div className="text-xs text-muted">{t.name}</div>
              </div>
              <div className={`font-mono tabular-nums text-right ${
                dir === "up" ? "text-up" : dir === "down" ? "text-down" : "text-muted"
              }`}>
                {p ? p.price.toFixed(2) : "—"}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
