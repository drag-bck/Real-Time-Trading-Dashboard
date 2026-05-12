import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { MarketFeed, Tick } from "./marketFeed";
import { verifyToken } from "./auth";

interface Client {
  ws: WebSocket;
  symbols: Set<string>;
}

export function attachWebSocket(server: Server, feed: MarketFeed) {
  const wss = new WebSocketServer({ noServer: true });
  const clients = new Set<Client>();

  server.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url ?? "/", "http://x");
    if (url.pathname !== "/ws") return socket.destroy();
    const token = url.searchParams.get("token") ?? "";
    if (!verifyToken(token)) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      return socket.destroy();
    }
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
  });

  wss.on("connection", (ws) => {
    const client: Client = { ws, symbols: new Set() };
    clients.add(client);

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.action === "subscribe" && Array.isArray(msg.symbols)) {
          client.symbols = new Set(msg.symbols.map(String));
        } else if (msg.action === "unsubscribe") {
          client.symbols.clear();
        }
      } catch {
        /* ignore */
      }
    });

    ws.on("close", () => clients.delete(client));
  });

  feed.on("tick", (tick: Tick) => {
    const payload = JSON.stringify({ type: "tick", ...tick });
    for (const c of clients) {
      if (c.ws.readyState === WebSocket.OPEN && c.symbols.has(tick.symbol)) {
        c.ws.send(payload);
      }
    }
  });

  return wss;
}
