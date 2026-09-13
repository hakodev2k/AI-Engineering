# Open-Meteo MCP Connector

Reusable Model Context Protocol server exposing scoped, read-only Open-Meteo weather and environmental-data operations through Open-Meteo's official REST APIs.

## Upstream strategy

Open-Meteo currently documents HTTP/JSON APIs rather than an official Open-Meteo MCP server, so this connector uses the official REST APIs directly and exposes a stable MCP interface over stdio. It does not depend on community MCP servers.

Official sources researched for this connector:

- API documentation: https://open-meteo.com/en/docs
- Historical Weather API: https://open-meteo.com/en/docs/historical-weather-api
- Pricing and documented public limits: https://open-meteo.com/en/pricing
- Product/API overview: https://open-meteo.com/

Open-Meteo's public non-commercial API requires no API key. Commercial/customer plans may use an API key; `OPEN_METEO_API_KEY` is optional and remains inside the connector.

## Implemented MCP tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `open_meteo.location.search` | Geocoding API | READ | No |
| `open_meteo.weather.forecast` | Forecast API | READ | No |
| `open_meteo.weather.history` | Historical Weather API | READ | No |
| `open_meteo.air_quality.forecast` | Air Quality API | READ | No |
| `open_meteo.marine.forecast` | Marine API | READ | No |
| `open_meteo.elevation.get` | Elevation API | READ | No |
| `open_meteo.flood.forecast` | Flood API | READ | No |
| `open_meteo.climate.projection` | Climate API | READ | No |
| `open_meteo.ensemble.forecast` | Ensemble API | READ | No |

All operations are read-only. This package intentionally exposes no arbitrary URL/request tool and no write/destructive operation.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict Zod validation
  -> OpenMeteoClient
  -> fixed allowlisted Open-Meteo API hosts
```

Provider responses are returned under `untrustedProviderData: true`; callers must treat weather/geocoding content as data, never as instructions.

## Authentication and permissions

Public non-commercial endpoints need no authentication. When a customer API key is configured, the connector appends it at request time and never returns it to MCP clients or logs it.

There are no OAuth scopes. Authorization is controlled by whichever Open-Meteo plan/API key is configured outside the agent process.

## Environment

Copy `.env.example` values into your runtime secret/configuration provider:

- `OPEN_METEO_TIMEOUT_MS` — per-request timeout, default `10000`.
- `OPEN_METEO_MAX_RETRIES` — bounded retry count, default `2`, maximum `5`.
- `OPEN_METEO_API_KEY` — optional customer/commercial API key.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server speaks MCP over stdio and can therefore be launched by MCP clients that support local stdio servers, including general MCP-capable agent hosts. Compatibility depends on the host's stdio MCP support rather than provider-specific integration.

## Example client configuration

```json
{
  "mcpServers": {
    "open-meteo": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/open-meteo/dist/src/server.js"],
      "env": {
        "OPEN_METEO_TIMEOUT_MS": "10000",
        "OPEN_METEO_MAX_RETRIES": "2"
      }
    }
  }
}
```

## Reliability and rate limits

The client uses AbortController timeouts and bounded exponential backoff. It retries only transient network errors and HTTP `429`, `500`, `502`, `503`, and `504`. It does not retry provider validation/auth failures. `Retry-After` is preserved when provided and used when it contains a delta in seconds.

Open-Meteo's public free tier currently documents limits of 600 calls/minute, 5,000/hour, 10,000/day, and 300,000/month, with commercial plans offering higher limits. These limits can change; production deployments should verify the current pricing page and use a paid/customer endpoint when required.

## Security

- No secret is required for the public API.
- Optional API keys are read only from process environment and never exposed as MCP parameters.
- Upstream hosts are hard-coded per capability; agents cannot supply arbitrary URLs, preventing SSRF through the connector surface.
- Coordinates, dates, enumeration values, search lengths, forecast horizons, and result counts are validated.
- Retrieved third-party data is explicitly marked untrusted.
- There are no write, destructive, billing, security-policy, or permission-changing tools.
- Retry counts are bounded to avoid request amplification.

## Errors

Provider HTTP errors are mapped to `OpenMeteoError` with HTTP status and `Retry-After` when present. Invalid MCP inputs fail locally before making a network request. Date-range tools also reject inverted date ranges before calling the provider.

## Tests

```bash
npm test
npm run build
```

Unit tests use fake `fetch` implementations and require no live credentials. They cover config defaults, schema rejection, URL encoding, provider error mapping, and bounded throttling retries.

## Limitations

- This connector exposes a curated set of agent-friendly variables rather than every parameter offered by Open-Meteo.
- It does not expose CSV/XLSX modes, arbitrary models, arbitrary variable lists, or arbitrary upstream URLs.
- Climate projection currently uses the documented `MRI_AGCM3_2_S` model to keep the MCP contract deterministic.
- Availability of individual variables, forecast horizons, models, and paid-plan behavior remains subject to Open-Meteo's current documentation and plan.
- Because Open-Meteo has no official MCP server documented in the researched official sources, all implemented tools use REST rather than upstream MCP.
