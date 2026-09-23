# Alpaca MCP/API Connector

Reusable MCP facade for Alpaca Trading workflows. It defaults to **paper trading** and keeps credentials inside the connector process.

## Official sources and transport

Alpaca maintains an official open-source Trading MCP Server (`alpacahq/alpaca-mcp-server`). Alpaca announced MCP Server V2 on 2026-04-09 with 61 actions, OpenAPI-driven synchronization and `ALPACA_TOOLSETS` filtering. Alpaca documentation states the Trading MCP server supports account/portfolio, stocks/options/crypto orders, market data, screeners/news/corporate actions and watchlists. As of the current documentation, Alpaca does not host the Trading MCP server remotely; users run/self-host it. Alpaca also introduced documentation-search access in the Trading MCP server on 2026-08-10.

This package exposes a deliberately smaller, stable MCP contract backed directly by Alpaca's official Trading REST API. Direct REST is used so approval gates and schemas remain under this connector's control; the official MCP server remains the recommended upstream when its broad native tool surface is desired. Broker MCP is a separate beta product and is not used here.

Official references:
- https://docs.alpaca.markets/us/docs/alpaca-mcp-server
- https://github.com/alpacahq/alpaca-mcp-server
- https://alpaca.markets/blog/alpaca-launches-mcp-server-v2/
- https://docs.alpaca.markets/us/docs/orders-at-alpaca

## Capabilities

15 implemented tools: `alpaca.account.get`, `alpaca.position.list`, `alpaca.position.get`, `alpaca.order.list`, `alpaca.order.get`, `alpaca.order.create`, `alpaca.order.cancel`, `alpaca.asset.search`, `alpaca.asset.get`, `alpaca.market.clock`, `alpaca.market.calendar`, `alpaca.watchlist.list`, `alpaca.watchlist.get`, `alpaca.watchlist.create`, `alpaca.watchlist.add_asset`.

No arbitrary HTTP tool is exposed. Options, crypto market-data, streaming, news, portfolio history, order replacement and bulk destructive actions are intentionally not part of this stable subset; use Alpaca's official MCP server when those native capabilities are required.

## Architecture and security

MCP client → strict Zod schema → risk/approval policy → `AlpacaClient` → official REST API. API key/secret are loaded only from process environment and are never tool parameters or normal outputs. Provider content is wrapped with `untrusted_provider_data: true`; callers must treat it as data, never instructions. URLs are fixed to Alpaca-owned hosts, preventing caller-controlled SSRF. Retries are bounded and limited to throttling/server failures. Validation/auth/permission failures are never retried. HTTP `Retry-After` is preserved. Requests have a timeout and accept cancellation signals.

`READ` executes automatically. `WRITE` requires an out-of-band approval token. Trading is `HIGH_RISK` and cancellation is `DESTRUCTIVE`; both always require explicit approval. This connector cannot elevate permissions. Live mode must be explicitly selected with `ALPACA_PAPER=false`; approval is still mandatory for trading actions.

## Authentication

Create Alpaca Trading API credentials and set `ALPACA_API_KEY` and `ALPACA_SECRET_KEY`. Use least-privilege credentials and paper keys for development. API-key authentication has no OAuth scope list; authorization is determined by the Alpaca account/key. Do not place keys in prompts or MCP arguments.

Environment: `ALPACA_API_KEY`, `ALPACA_SECRET_KEY`, `ALPACA_PAPER` (default `true`), `ALPACA_APPROVAL_TOKEN`, `ALPACA_TIMEOUT_MS`, `ALPACA_MAX_RETRIES`.

## Install and run

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# load env using your process manager/secret store
npm start
```

The server uses MCP stdio and therefore works with MCP clients that support launching a local stdio server. Configure the client to run `npm start` in this directory and inject environment variables using the client's secure environment/secret mechanism. Do not infer remote-HTTP compatibility from this package.

## Approval model

`ALPACA_APPROVAL_TOKEN` is a connector-side shared approval proof. A trusted host/UI should obtain explicit human consent and inject the proof into the approved tool call. The model should not be given the token. Production deployments should replace this simple adapter with their host's authenticated approval/session mechanism while retaining the policy boundary.

## Reliability and rate limits

The client handles 429 and 5xx with bounded exponential backoff and honors `Retry-After`. It does not guess a fixed Trading API quota because limits can vary by Alpaca service/account. Pagination parameters are bounded (`order.list` max 500). Writes should be idempotency-aware using `client_order_id`; callers should query order state before retrying uncertain submissions. This implementation intentionally avoids automatic retry logic specific to destructive semantics beyond transport-level server/throttle handling; for production live trading, configure retries conservatively (including zero) and reconcile order state after ambiguous network failures.

## Errors

Provider errors are mapped to structured MCP errors containing message, HTTP status and retry delay where available. Validation errors are returned by the MCP handler without exposing secrets. Authentication failures require user/operator action rather than credential guessing.

## Tests

`npm test` uses mocks only and needs no live credentials. Coverage includes auth configuration, secure paper default, tool registration, read operation, approval denial, order validation, credential isolation and throttling/error behavior.

## Limitations

This connector does not implement OAuth token refresh because Trading API key authentication is used. It does not expose Broker API, hosted Broker MCP, arbitrary URLs, bulk cancel/close, account configuration changes or funding. Alpaca's official MCP server is substantially broader and should be preferred when its toolset filtering and full supported coverage are appropriate. Financial actions can cause real loss; keep paper mode on for testing and require authenticated human approval for every live write.
