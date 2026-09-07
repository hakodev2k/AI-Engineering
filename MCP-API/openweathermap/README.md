# OpenWeather MCP/API Connector

Reusable MCP stdio server exposing a stable, read-only OpenWeather tool surface for weather, forecast, geocoding, air-quality, and One Call workflows.

## Upstream strategy

OpenWeather currently provides two relevant integration paths:

- Official OpenWeather REST APIs at `https://api.openweathermap.org` using an OpenWeather API key (`appid`).
- An official OpenWeather-branded MCP agent lane at `https://mcp.openweathermap.org/mcp`, powered/operated by The Bot Forum. OpenWeather documents six MCP tools covering feed discovery/inspection, signup, data fetch, balance and top-up-link workflows.

This connector deliberately uses the official REST APIs for its implemented data tools. That is the safer deterministic transport for users who already provision and control an OpenWeather account/API key, avoids silently creating a separate agent-lane account or commercial relationship, and keeps a fixed allow-listed tool contract. The official MCP endpoint is recorded in configuration for environments that explicitly choose the OpenWeather agent lane; this package does not auto-discover or proxy newly added upstream tools.

Official sources researched:

- OpenWeather API catalog: https://openweathermap.org/api
- OpenWeather for agents / official MCP: https://openweathermap.org/agents/
- API-key authentication and FAQ: https://openweathermap.org/faq
- One Call API 3.0 documentation: https://openweathermap.org/api/one-call-3
- Pricing and limits: https://openweathermap.org/full-price
- API care recommendations: https://openweathermap.org/appid

As of September 2026, OpenWeather also promotes One Call API 4.0. This connector does not invent 4.0 endpoint contracts that are not pinned here; its premium unified tools use the documented One Call 3.0 REST contract, while free-access tools use the current Weather/Forecast/Geocoding/Air Pollution endpoints.

## Architecture

`MCP client -> strict Zod schema -> fixed tool dispatcher -> OpenWeatherClient -> official HTTPS REST API`

The API key exists only in the connector configuration/client layer and is appended as the provider-required `appid` query parameter immediately before the outbound request. It is never accepted as an MCP tool argument or returned to callers.

Provider data is tagged `source: "untrusted_provider_data"`. Weather descriptions, place names, alert text, or any other retrieved content must be treated as data, never as agent instructions or permission changes.

## Authentication and permissions

Create an OpenWeather account and API key, then set `OPENWEATHER_API_KEY`. OpenWeather uses API-key authentication rather than OAuth scopes for these endpoints. Product entitlement is account/subscription based; One Call 3.0 tools require the corresponding subscription.

Use only the products needed by the deployment. This connector exposes no account-management, billing, key-management, write, or destructive operation.

## Environment

Required:

- `OPENWEATHER_API_KEY`

Optional:

- `OPENWEATHER_BASE_URL=https://api.openweathermap.org` — validated and host-pinned; other hosts are rejected to prevent SSRF.
- `OPENWEATHER_TIMEOUT_MS=15000`
- `OPENWEATHER_MAX_RETRIES=3` — capped at 5.
- `OPENWEATHER_MCP_URL=https://mcp.openweathermap.org/mcp` — metadata/configuration for the official agent-lane MCP endpoint; not automatically proxied.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio and therefore works with MCP clients capable of launching a local stdio server. Configure the client to launch `node dist/src/server.js` and inject secrets through its environment/secret manager.

## Implemented tools

| Tool | Upstream | Risk | Approval | Purpose |
|---|---|---|---|---|
| `openweathermap.location.search` | REST Geocoding | READ | no | Place name to coordinates |
| `openweathermap.location.reverse` | REST Geocoding | READ | no | Coordinates to nearby places |
| `openweathermap.weather.current` | REST Weather | READ | no | Current conditions |
| `openweathermap.forecast.five_day` | REST Forecast | READ | no | 5-day / 3-hour forecast |
| `openweathermap.air_pollution.current` | REST Air Pollution | READ | no | Current AQI and pollutant concentrations |
| `openweathermap.air_pollution.forecast` | REST Air Pollution | READ | no | Forecast air pollution |
| `openweathermap.one_call.current_forecast` | REST One Call 3.0 | READ | no | Current/minutely/hourly/daily/alerts bundle |
| `openweathermap.one_call.timemachine` | REST One Call 3.0 | READ | no | Timestamp weather lookup within subscription coverage |

No generic `request(url, body)` escape hatch exists.

## Permission and approval model

Every exposed operation is `READ`. No WRITE, HIGH_RISK, or DESTRUCTIVE tool is registered, so there is no connector-side approval token. Billing changes, subscription changes, API-key rotation, account signup, agent-lane signup, and top-ups are intentionally outside this connector.

The separate official MCP agent lane can return a top-up link, but OpenWeather explicitly documents that the agent cannot itself complete payment. This connector does not expose that commercial workflow.

## Rate limits and reliability

OpenWeather limits vary by product/subscription. OpenWeather's current FAQ/pricing documentation states that free-access APIs are commonly constrained by per-minute and monthly quotas, while One Call products use their own subscription model. HTTP 429 indicates a quota/rate-limit condition.

The client:

- applies an AbortController timeout to every request;
- retries only network failures, HTTP 429, and HTTP 5xx responses;
- uses bounded exponential backoff;
- respects `Retry-After` on 429 when present, capped to 30 seconds per retry;
- caps retry count at 5;
- does not retry authentication or normal validation/client errors;
- avoids fan-out behavior: each MCP tool invocation maps to one provider request.

OpenWeather recommends avoiding unnecessarily frequent requests for the same location because model updates are not continuous.

## Error handling

- `401`: invalid/missing API key or missing product entitlement.
- `404`: invalid location/resource/route.
- `429`: quota/rate limit reached; retry information is preserved when provided.
- other `4xx`: surfaced as rejected provider requests and are not retried.
- `5xx` and transient network failures: bounded retry, then surfaced.
- timeout: request is cancelled and eventually surfaced after bounded retry exhaustion.

Errors never include the configured API key.

## Security considerations

The connector uses secure defaults:

- credentials remain in the connector layer, not prompts or tool arguments;
- outbound host is pinned to `api.openweathermap.org` and HTTPS;
- tool schemas reject unknown properties and constrain coordinates, limits, languages, units, and allowed `exclude` values;
- no arbitrary URL, raw endpoint, file, shell, webhook, billing, or credential-management tool is exposed;
- all provider responses are explicitly marked untrusted;
- upstream MCP discovery is disabled, preventing newly introduced remote tools from silently becoming available;
- MCP/REST content cannot increase permissions or enable additional tools.

For any webhook-like or event-driven weather workflow, build a separate scheduler/consumer rather than treating provider content as executable instructions.

## Official MCP notes

OpenWeather's current agent page documents `https://mcp.openweathermap.org/mcp` and describes six tools: catalog/list feeds, inspect a feed, sign up, fetch data, read balance, and obtain a top-up link. The agent lane is OpenWeather-branded and uses OpenWeather data, but its account/balance/payment platform is operated by The Bot Forum. It has a separate prepaid usage model from a normal OpenWeather API-key account.

Because those account and commercial semantics are materially different from a normal preconfigured OpenWeather account, this reusable connector does not silently switch between the two identities. Agent callers see one stable external contract regardless of OpenWeather product implementation details.

## Testing

```bash
npm test
```

Unit tests require no live credentials and use fake `fetch` implementations. They cover configuration/authentication requirements, SSRF host pinning, tool registration, strict validation, credential isolation, pagination parameters, provider success, and 429/retry-after error mapping.

## Usage examples

See `examples/workflows.md` for tool names, inputs, output shape expectations, permissions, and approval requirements.

## Limitations

- No mutation or billing/account-management tools.
- No automatic upstream MCP discovery or proxying.
- One Call tools target the documented 3.0 REST contract and require entitlement.
- Exact product availability, historical ranges, pricing, free allowances, and rate limits depend on the active OpenWeather plan and may change; consult official pricing/FAQ before production rollout.
- This package exposes stdio transport only; clients must be able to launch a local process.
- Retrieved weather and alert data can contain external text and must remain untrusted input to higher-level agents.
