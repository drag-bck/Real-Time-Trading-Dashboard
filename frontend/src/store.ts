import { create } from "zustand";
import type { Tick } from "./types";

interface State {
  token: string | null;
  username: string | null;
  prices: Record<string, { price: number; prev: number; ts: number }>;
  selected: string | null;
  setAuth: (token: string, username: string) => void;
  logout: () => void;
  applyTick: (t: Tick) => void;
  select: (s: string) => void;
}

export const useStore = create<State>((set) => ({
  token: localStorage.getItem("token"),
  username: localStorage.getItem("username"),
  prices: {},
  selected: null,
  setAuth: (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    set({ token, username });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    set({ token: null, username: null, prices: {}, selected: null });
  },
  applyTick: (t) =>
    set((s) => {
      const prev = s.prices[t.symbol]?.price ?? t.price;
      return { prices: { ...s.prices, [t.symbol]: { price: t.price, prev, ts: t.ts } } };
    }),
  select: (selected) => set({ selected }),
}));
