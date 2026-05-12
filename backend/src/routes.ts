import { Router, Request, Response, NextFunction } from "express";
import { TICKERS } from "./tickers";
import { getHistory } from "./history";
import { issueToken, verifyToken } from "./auth";

export const router = Router();

router.post("/auth/login", (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  // Mocked auth — accept any credentials.
  return res.json({ token: issueToken(String(username)), user: { name: String(username) } });
});

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "unauthorized" });
  (req as any).user = payload;
  next();
}

router.get("/tickers", requireAuth, (_req, res) => {
  res.json(TICKERS.map(({ symbol, name }) => ({ symbol, name })));
});

router.get("/tickers/:symbol/history", requireAuth, (req, res) => {
  const days = Math.min(365, Math.max(1, Number(req.query.days ?? 30)));
  const data = getHistory(req.params.symbol, days);
  if (!data) return res.status(404).json({ error: "unknown symbol" });
  res.json({ symbol: req.params.symbol, days, candles: data });
});

router.get("/health", (_req, res) => res.json({ ok: true }));
