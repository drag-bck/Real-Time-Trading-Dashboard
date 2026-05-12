import express from "express";
import cors from "cors";
import http from "http";
import { config } from "./config";
import { router } from "./routes";
import { MarketFeed } from "./marketFeed";
import { attachWebSocket } from "./ws";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api", router);
  return app;
}

if (require.main === module) {
  const app = createApp();
  const server = http.createServer(app);
  const feed = new MarketFeed(undefined, config.tickIntervalMs);
  attachWebSocket(server, feed);
  feed.start();
  server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Trading backend listening on :${config.port}`);
  });
}
