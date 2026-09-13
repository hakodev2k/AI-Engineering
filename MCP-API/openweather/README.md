# OpenWeather MCP Connector

Reusable Model Context Protocol server exposing scoped OpenWeather operations through the official OpenWeather REST APIs.

## Transport and official sources

No official OpenWeather MCP server was identified during implementation, so this connector uses the provider's official HTTP APIs directly. Primary references: OpenWeather API documentation (`https://openweathermap.org/api`), Current Weather (`https://openweathermap.org/current`), 5 Day / 3 Hour Forecast (`https://openweathermap.org/forecast5`), Geocoding (`https://openweathermap.org/api/geocoding-api`), Air Pollution (`https://openweathermap.org/api/air-pollution`), and One Call 3.0 (`https://openweathermap.org/api/one-call-3`). Authentication uses the OpenWeather API key (`appid`) described by the official documentation.

## Capabilities

| MCP tool | Upstream | Risk | Approval | Notes |
|---|---|---|---|---|
| `openweather.location.search` | Geocoding API | READ | No | Direct geocoding, max 5 results |
| `openweather.location.zip` | Geocoding API | READ | No | Postal code + ISO country |
| `openweather.weather.current` | Current Weather API | READ | No | Coordinates, units, language |
| `openweather.forecast.five_day` | 5 Day / 3 Hour Forecast API | READ | No | Forecast list |
| `openweather.air.current` | Air Pollution API | READ | No | AQI and components |
| `openweather.air.forecast` | Air Pollution API | READ | No | Forecast pollution data |
| `openweather.air.history` | Air Pollution API | READ | No | Unix start/end range |
| `openweather.onecall.summary` | One Call 3.0 overview | READ | No | Requires applicable One Call subscription/access |
| `openweather.onecall.timemachine` | One Call 3.0 | READ | No | Historical timestamp; subscription/access dependent |

The connector intentionally exposes no arbitrary HTTP tool and no mutation operations. OpenWeather data is returned with `untrustedProviderData: true`; clients and agents must treat weather text and metadata as data rather than instructions.

## Architecture

`server.ts` hosts an MCP stdio server. `tools.ts` defines the stable provider-scoped tools and strict schemas. `client.ts` owns credentials and HTTP execution, bounded retries, throttling handling, timeout/cancellation, and provider error mapping. `schemas.ts` validates coordinate ranges, time ranges, language, units, and geocoding inputs. The API key never appears in MCP tool arguments or outputs.

## Authentication and permissions

Create an OpenWeather API key in your OpenWeather account and set `OPENWEATHER_API_KEY`. The provider uses API-key authentication rather than OAuth scopes; least privilege therefore comes from using a dedicated key/account entitlement and exposing only read tools. The connector's logical permission is `weather.read`. Some products/endpoints can require a paid subscription or separate activation; a 401/403 from such an endpoint is surfaced without retrying.

## Environment

Copy `.env.example` into your secret-management workflow. Do not commit populated environment files.

- `OPENWEATHER_API_KEY` — required provider credential.
- `OPENWEATHER_TIMEOUT_MS` — request timeout; default 10000.
- `OPENWEATHER_MAX_RETRIES` — bounded retry count for transient network/429/5xx failures; default 2, maximum 5.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
OPENWEATHER_API_KEY=... npm start
```

Configure an MCP client to launch `node <connector-path>/dist/src/server.js` and inject the credential into the process environment. The server uses MCP stdio and therefore works with MCP clients that support launching local stdio servers. Compatibility depends on the client's MCP stdio support; no provider-specific client integration is assumed.

## Usage examples

See `examples/workflows.md`. Typical flow: resolve a location to coordinates, then request current weather, forecast, and air quality. Tool results preserve provider JSON instead of attempting to reinterpret meteorological fields.

## Reliability and rate limits

The connector detects HTTP 429 and `Retry-After`, and retries 429/5xx/network failures with bounded exponential backoff. Authentication/authorization and validation failures are not retried. Requests have a configurable timeout and accept cancellation internally. Pagination is not synthesized: implemented OpenWeather endpoints either return bounded objects/lists or use explicit query ranges; direct geocoding is capped at five results to avoid unnecessary calls.

OpenWeather rate limits and quotas depend on product/subscription. The connector does not invent a universal request-per-minute value; provider 429 responses are preserved and respected. Callers should avoid polling more frequently than the freshness needed by their workflow.

## Error handling

Provider non-success responses become `OpenWeatherError` with status and optional retry-after metadata. Credentials are never included in error messages by this connector. 401/403 generally require key/subscription action; 429 indicates throttling; 5xx/network failures are retried only within the configured bound.

## Security

Credentials remain in the connector layer and are appended only to requests sent to fixed OpenWeather origins. Callers cannot supply arbitrary URLs, preventing this connector from becoming an SSRF proxy. Inputs use strict Zod schemas and coordinate/time bounds. Provider responses are untrusted external content. Logging must not add URLs containing the `appid` query parameter. No tool can change permissions, billing, provider configuration, or external resources.

## Testing

```bash
npm test
npm run build
```

Tests use mocked fetch and require no live credential. They cover missing authentication configuration, validation, read execution, credential isolation at the tool boundary, non-retryable auth errors, and throttling retry behavior.

## Limitations

This package implements a focused subset of OpenWeather rather than every endpoint. It does not expose weather maps, bulk downloads, dashboard/account administration, payments, or arbitrary API requests. One Call 3.0 overview/time-machine availability and historical depth depend on the user's OpenWeather subscription. Forecast/current availability and quota also depend on provider plan terms. There is no upstream official MCP transport in this implementation; all implemented capabilities route to official REST APIs.
