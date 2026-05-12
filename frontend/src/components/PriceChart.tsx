import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fetchHistory } from "../api";
import { useStore } from "../store";

interface Point { t: number; price: number; }

export default function PriceChart({ symbol }: { symbol: string }) {
  const token = useStore((s) => s.token)!;
  const livePrice = useStore((s) => s.prices[symbol]?.price);
  const [data, setData] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  // Load history when symbol changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchHistory(token, symbol, 30).then((c) => {
      if (cancelled) return;
      setData(c.map((x) => ({ t: x.t, price: x.close })));
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [token, symbol]);

  // Append live ticks (rolling, keep last ~120 intraday points after history).
  useEffect(() => {
    if (livePrice == null) return;
    setData((prev) => {
      const last = prev[prev.length - 1];
      const next: Point = { t: Date.now(), price: livePrice };
      // Avoid duplicate timestamps.
      if (last && Math.abs(last.t - next.t) < 250) return prev;
      const merged = [...prev, next];
      return merged.length > 250 ? merged.slice(merged.length - 250) : merged;
    });
  }, [livePrice]);

  if (loading) return <div className="h-96 flex items-center justify-center text-muted">Loading chart…</div>;

  const first = data[0]?.price ?? 0;
  const last = data[data.length - 1]?.price ?? 0;
  const change = last - first;
  const pct = first ? (change / first) * 100 : 0;
  const positive = change >= 0;

  return (
    <div className="bg-surface border border-line rounded-xl p-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="font-mono text-sm text-muted">{symbol}</div>
          <div className="font-serif text-4xl font-bold tabular-nums">
            {last.toFixed(2)}
          </div>
          <div className={`text-sm font-mono mt-1 ${positive ? "text-up" : "text-down"}`}>
            {positive ? "▲" : "▼"} {Math.abs(change).toFixed(2)} ({pct.toFixed(2)}%)
          </div>
        </div>
        <div className="text-xs text-muted uppercase tracking-wider">30D + Live</div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e8ecf1" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="t"
              tickFormatter={(t) => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              stroke="#5b6577"
              fontSize={11}
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="#5b6577"
              fontSize={11}
              tickFormatter={(v) => v.toFixed(0)}
              width={50}
            />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 8, fontSize: 12 }}
              labelFormatter={(t) => new Date(t).toLocaleString()}
              formatter={(v: number) => v.toFixed(2)}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={positive ? "#16a34a" : "#dc2626"}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
