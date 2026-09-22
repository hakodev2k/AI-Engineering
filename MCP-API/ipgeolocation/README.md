# IPGeolocation.io MCP/API Connector

Reusable MCP server exposing a deliberately scoped subset of the official IPGeolocation.io v3 REST APIs. No official IPGeolocation.io MCP server was found during implementation, so the connector uses the provider's official REST API directly while presenting stable MCP tools.

## Official sources

- API portfolio: https://ipgeolocation.io/documentation.html
- IP Geolocation: https://ipgeolocation.io/documentation/ip-location-api.html
- Time Zone: https://ipgeolocation.io/documentation/timezone-api.html
- User Agent: https://ipgeolocation.io/documentation/user-agent-api.html
- Abuse Contact: https://ipgeolocation.io/documentation/ip-abuse-contact-api.html

The official documentation describes IP geolocation, IP Security, ASN, Abuse Contact, Time Zone, User-Agent, and Astronomy APIs. Authentication is by API key for these server-side calls. The Free plan is documented with a 1000-request/day hard limit; paid plans are quota/billing based. Bulk geolocation can support far larger batches upstream, but this connector intentionally caps a tool call at 1000 inputs to bound agent cost and payload size.

## Architecture

`MCP client -> stdio MCP server -> strict Zod tool schema -> policy gates -> IpGeoClient -> official HTTPS REST API`

Credentials stay in the client layer and are never returned to the model. Provider content is treated as untrusted data. The base URL defaults to the official API and is configurable for testing/private gateways.

## Installation

Requires Node.js 20+.

```bash
npm install
npm run build
```

Copy `.env.example` into your secret/config system and set `IPGEO_API_KEY`. Never commit a real key.

## Run

```bash
npm start
```

The server uses MCP stdio transport, so it can be launched by MCP clients that support local stdio servers.

## Tools

| Tool | Transport | Risk | Approval/gate |
|---|---|---|---|
| `ipgeolocation.ip.lookup` | REST `/v3/ipgeo` | READ | none |
| `ipgeolocation.ip.bulk_lookup` | REST `/v3/ipgeo-bulk` | WRITE/quota-sensitive | `IPGEO_ALLOW_BULK=true` |
| `ipgeolocation.security.lookup` | REST `/v3/security` | WRITE/credit-sensitive | `IPGEO_ALLOW_PAID_MODULES=true` |
| `ipgeolocation.asn.lookup` | REST `/v3/asn` | READ | none |
| `ipgeolocation.abuse.lookup` | REST `/v3/abuse` | WRITE/credit-sensitive | `IPGEO_ALLOW_PAID_MODULES=true` |
| `ipgeolocation.timezone.lookup` | REST `/v3/timezone` | READ | none |
| `ipgeolocation.timezone.convert` | REST `/v3/timezone/convert` | READ | none |
| `ipgeolocation.astronomy.lookup` | REST `/v3/astronomy` | READ | none |
| `ipgeolocation.user_agent.parse` | REST `/v3/user-agent` | WRITE/credit-sensitive | `IPGEO_ALLOW_PAID_MODULES=true` |

The WRITE label on paid/bulk lookups means external side effect on quota/billing, not mutation of provider data. No destructive tool exists.

## Authentication and least privilege

Set only `IPGEO_API_KEY`. The connector does not accept credentials in tool arguments. API-key permissions and subscription capabilities are controlled in the provider account. Do not expose the key to prompts, logs, or client-visible errors.

## Configuration

- `IPGEO_API_KEY` required.
- `IPGEO_BASE_URL` defaults to `https://api.ipgeolocation.io`.
- `IPGEO_TIMEOUT_MS` defaults to 10000.
- `IPGEO_MAX_RETRIES` defaults to 2.
- `IPGEO_ALLOW_PAID_MODULES` defaults to false.
- `IPGEO_ALLOW_BULK` defaults to false.

## Reliability and rate limits

Requests have an AbortController timeout and bounded exponential backoff. HTTP 429 and 5xx responses may retry up to the configured bound and `Retry-After` is honored when present. Validation/authentication failures are not retried. Keep `IPGEO_MAX_RETRIES` small because successful retries can still consume quota depending on provider processing.

## Security

Tool schemas constrain strings, arrays, coordinates, and dates. There is no arbitrary URL/request tool, preventing the connector from becoming an SSRF proxy. The API base URL is operator configuration, never model input. Paid and bulk operations are disabled by default. Provider responses can contain attacker-controlled network/domain metadata and must be treated as data, never as instructions. Do not log request URLs because the provider API key is carried as an `apiKey` query parameter. Returned abuse-contact information can contain personal/business contact data; expose it only to workflows that need it.

## Error handling

Provider HTTP errors are mapped to `IpGeoError` with status and safe provider message. API keys are not included in error text. 429 retains retry-after metadata internally. Timeouts abort network requests. Invalid tool inputs fail before network I/O.

## Testing

```bash
npm test
npm run build
```

Unit tests use mocked `fetch`; live credentials are not required. Tests cover missing authentication, paid/bulk permission denial, safe error mapping, and bounded retry.

## Limitations

This connector intentionally implements nine high-value operations rather than the entire portfolio. Availability of fields/modules depends on the IPGeolocation.io subscription. Paid-module gates are conservative and do not replace provider-side billing controls. The connector does not implement browser Request-Origin authentication, realtime client-side proxy/VPN detection, webhooks, or arbitrary provider requests. It does not claim an upstream MCP transport because the researched official integration surface is REST/SDK based.
