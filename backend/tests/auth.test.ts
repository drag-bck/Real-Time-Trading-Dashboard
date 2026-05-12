import request from "supertest";
import { createApp } from "../src/index";
import { issueToken, verifyToken } from "../src/auth";
import { describe, expect, it } from "@jest/globals";

describe("auth", () => {
  it("issues and verifies a token", () => {
    const t = issueToken("alice");
    expect(verifyToken(t)?.sub).toBe("alice");
    expect(verifyToken("bogus")).toBeNull();
  });
});

describe("REST", () => {
  const app = createApp();

  it("rejects unauthenticated /tickers", async () => {
    await request(app).get("/api/tickers").expect(401);
  });

  it("logs in and returns tickers", async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({ username: "a", password: "b" })
      .expect(200);
    const token = login.body.token;
    const res = await request(app)
      .get("/api/tickers")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("returns historical candles", async () => {
    const {
      body: { token },
    } = await request(app)
      .post("/api/auth/login")
      .send({ username: "a", password: "b" });
    const res = await request(app)
      .get("/api/tickers/AAPL/history?days=5")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body.candles).toHaveLength(5);
  });
});
