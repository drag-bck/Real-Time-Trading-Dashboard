import { MarketFeed } from "../src/marketFeed";
import { describe, expect, it } from "@jest/globals";

describe("MarketFeed", () => {
  it("emits one tick per ticker per step", () => {
    const feed = new MarketFeed(
      [
        {
          symbol: "X",
          name: "X",
          basePrice: 100,
          volatility: 0.2,
          drift: 0.05,
        },
      ],
      1000,
    );
    const ticks = feed.step();
    expect(ticks).toHaveLength(1);
    expect(ticks[0].symbol).toBe("X");
    expect(ticks[0].price).toBeGreaterThan(0);
  });

  it("keeps prices positive across many steps", () => {
    const feed = new MarketFeed(undefined, 1000);
    for (let i = 0; i < 500; i++) feed.step();
    for (const t of (feed as any).prices.values()) {
      expect(t).toBeGreaterThan(0);
    }
  });

  it("notifies listeners via the tick event", () => {
    const feed = new MarketFeed(
      [{ symbol: "Y", name: "Y", basePrice: 50, volatility: 0.1, drift: 0 }],
      1000,
    );
    const seen: string[] = [];
    feed.on("tick", (t) => seen.push(t.symbol));
    feed.step();
    expect(seen).toEqual(["Y"]);
  });
});
