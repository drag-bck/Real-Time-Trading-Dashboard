# Real-Time Trading Dashboard

A full-stack real-time trading dashboard with a Node.js (TypeScript) backend microservice and a React + TypeScript frontend.

## Architecture

```
┌──────────────────┐    REST + WS    ┌─────────────────────┐
│ React + TS (Vite)│ ──────────────► │ Node.js + Express   │
│ Recharts, Zustand│ ◄────────────── │ ws, JWT, Jest       │
└──────────────────┘                 └─────────────────────┘
                                            │
                                     Mock market feed
                                     (Geometric Brownian Motion)
```

- **backend/** — Node.js + TypeScript microservice. Express REST API, `ws` WebSocket server, mocked market feed, in-memory cache for historical data, mocked JWT auth, Jest unit tests, Dockerfile.
- **frontend/** — React + TypeScript (Vite) dashboard. Recharts for charts, Zustand for state, Tailwind for styling, Dockerfile (nginx).
- **k8s/** — Kubernetes manifests (Deployment + Service for backend & frontend, optional Ingress).

## Quick start (Docker Compose)

```bash
docker-compose up --build
# frontend: http://localhost:8080
# backend:  http://localhost:4000
```

## Quick start (local)

```bash
# backend
cd backend && npm install && npm run dev    # http://localhost:4000

# frontend
cd frontend && npm install && npm run dev   # http://localhost:5173
```

## Login (mocked auth)

Any non-empty username/password works. The backend issues a signed JWT (HS256, secret from `JWT_SECRET`, default `dev-secret`).

## API

| Method | Path                           | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| POST   | `/api/auth/login`              | Returns `{ token }`                |
| GET    | `/api/tickers`                 | List available tickers             |
| GET    | `/api/tickers/:symbol/history` | Historical OHLC (mocked, cached)   |
| WS     | `/ws?token=...`                | Stream `{symbol, price, ts}` ticks |

WebSocket protocol — client sends `{"action":"subscribe","symbols":["AAPL","TSLA"]}` and receives JSON tick messages.

## Tests

```bash
cd backend && npm test
```

Covers: market feed generator bounds, history cache hit/miss, auth token issue/verify, REST handlers.

## Trade-offs / Assumptions

- Market data is **simulated** with Geometric Brownian Motion per ticker — no external API keys required.
- Auth is **mocked**: any credentials accepted, JWT signed locally. No user store.
- Historical data is generated deterministically per symbol per UTC day, then cached in-memory (LRU, 100 entries).
- Single-process backend; horizontal scale would need a shared pub/sub (Redis, NATS) for the tick stream.
- No persistent DB — keeps the project self-contained.

## Bonus features included

- ✅ Mock authentication (JWT)
- ✅ Caching for historical data (in-memory LRU)
- ✅ Docker (per service) + docker-compose
- ✅ Kubernetes manifests (`k8s/`)
