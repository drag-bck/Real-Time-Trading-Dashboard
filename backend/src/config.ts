export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret",
  tickIntervalMs: Number(process.env.TICK_INTERVAL_MS ?? 1000),
};
