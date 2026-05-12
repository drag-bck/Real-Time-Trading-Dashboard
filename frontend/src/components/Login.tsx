import { useState } from "react";
import { login } from "../api";
import { useStore } from "../store";

export default function Login() {
  const setAuth = useStore((s) => s.setAuth);
  const [username, setU] = useState("trader");
  const [password, setP] = useState("demo");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    try {
      const token = await login(username, password);
      setAuth(token, username);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-surface border border-line rounded-2xl p-8 shadow-sm">
        <h1 className="font-serif text-3xl font-bold mb-1">Markets</h1>
        <p className="text-muted text-sm mb-6">Sign in to view live prices.</p>
        <label className="block text-xs uppercase tracking-wider text-muted mb-1">Username</label>
        <input value={username} onChange={(e) => setU(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
        <label className="block text-xs uppercase tracking-wider text-muted mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setP(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
        {err && <p className="text-down text-sm mb-3">{err}</p>}
        <button disabled={loading}
          className="w-full bg-ink text-white rounded-md py-2 font-medium hover:bg-accent transition">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-xs text-muted mt-4">Mocked auth — any non-empty credentials work.</p>
      </form>
    </div>
  );
}
