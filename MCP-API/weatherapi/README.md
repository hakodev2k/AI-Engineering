# WeatherAPI.com MCP Connector

Reusable, read-only MCP connector for WeatherAPI.com weather and geolocation data.

## Transport strategy
WeatherAPI.com announced an official `weatherapi-mcp` package in March 2026. This connector deliberately exposes a smaller, stable, provider-scoped allowlist over the official HTTPS REST API. That keeps credentials inside the connector, provides strict Zod validation, predictable error semantics, bounded retries, and prevents automatic trust of newly added upstream tools. No write API is needed for the implemented workflows.

Official sources: WeatherAPI documentation (`https://www.weatherapi.com/docs/`), official MCP announcement (`https://blog.weatherapi.com/weatherapi-mcp-server-claude-ai-integration/`), and terms/rate-limit policy (`https://www.weatherapi.com/terms.aspx`).

## Capabilities
Ten MCP tools are implemented: `weatherapi.location.search`, `weatherapi.weather.current`, `weatherapi.weather.forecast`, `weatherapi.weather.history`, `weatherapi.weather.future`, `weatherapi.weather.alerts`, `weatherapi.marine.forecast`, `weatherapi.astronomy.get`, `weatherapi.timezone.get`, and `weatherapi.ip.lookup`.

All are READ. The provider supports additional products (sports, bulk, maps, solar irradiance, pollen and enterprise fields), but they are intentionally not exposed as separate tools here. Availability of forecast/history/future/marine/AQI/pollen data depends on the WeatherAPI plan.

## Architecture
`server.ts` exposes stdio MCP tools; `tools.ts` owns strict schemas and the capability allowlist; `client.ts` owns HTTPS transport, API-key injection, timeout, retry, rate-limit and provider-error mapping; `core.ts` validates configuration. The model never receives the raw key through a tool argument or response.

## Authentication
Create a WeatherAPI.com API key and set `WEATHERAPI_KEY`. WeatherAPI authenticates REST calls with the `key` query parameter. The connector injects it internally. Never put it in prompts, tool arguments, source control, or logs. No OAuth scopes exist for this API-key model; access is governed by the account/plan attached to the key.

## Install and run
Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# load WEATHERAPI_KEY using your process/secret manager
npm run build
npm start
```

Configure any MCP client that supports a local stdio MCP server to execute `node /absolute/path/dist/server.js` with `WEATHERAPI_KEY` supplied by its secure environment configuration. Compatibility depends on that client's standard stdio MCP support.

## Configuration
`WEATHERAPI_KEY` is required. `WEATHERAPI_BASE_URL` defaults to and is restricted to `https://api.weatherapi.com/v1` to prevent SSRF. `WEATHERAPI_TIMEOUT_MS` defaults to 10000. `WEATHERAPI_MAX_RETRIES` defaults to 2 and is capped at 3.

## Permissions and approval
Every exposed tool is READ and may auto-execute. There are no WRITE, HIGH_RISK, or DESTRUCTIVE tools, so no approval token is accepted. Adding a write-capable provider feature in the future must introduce explicit permission and approval policy rather than widening the generic client.

## Reliability and rate limits
The client propagates caller cancellation, enforces a timeout, and performs bounded exponential-backoff retries only for network failures, HTTP 429, and HTTP 5xx. Validation, 401, and 403 failures are not retried. `Retry-After` is honored when present. WeatherAPI limits are plan-specific and can include monthly allocations and per-minute burst limits; callers should cache suitable weather data and avoid polling unnecessarily.

## Errors
Errors are normalized to `AUTH_CONFIG`, `UNSAFE_BASE_URL`, `VALIDATION`, `AUTH`, `RATE_LIMIT`, `TIMEOUT`, `NETWORK`, or `PROVIDER`, with HTTP status and retry-after metadata where available. Provider JSON is returned as untrusted data.

## Security
Only ten fixed HTTPS endpoints are allowlisted. The base host is pinned to `api.weatherapi.com`; arbitrary URLs are impossible through tools. Tool inputs cannot carry credentials. Responses are never treated as instructions and cannot alter permissions. Avoid logging request URLs because WeatherAPI's API-key authentication places the key in the query string. Rotate compromised keys immediately.

## Testing
Run `npm test`. Unit tests use mocked fetch/client behavior and require no live credentials. They cover tool registration, risk classification, validation, successful reads, credential isolation behavior, auth failure non-retry, and endpoint allowlisting.

## Limitations
This package does not proxy the upstream MCP server, expose XML, perform bulk requests, or bypass subscription limits. It does not cache results. Historical/future date availability and premium fields are enforced by WeatherAPI.com and the account plan.
