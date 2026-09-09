# EasyPost MCP/API Connector

Reusable MCP server exposing a focused set of EasyPost shipping, rating, label-purchase, tracking, address, parcel, and webhook operations through the official EasyPost REST API.

## Transport and official sources

This connector uses the official EasyPost REST API at `https://api.easypost.com/v2`. No official EasyPost MCP server was identified in EasyPost's official documentation reviewed for this implementation, so there is no upstream MCP dependency or unofficial MCP server. The connector itself exposes REST-backed operations as MCP tools over stdio.

Official references used:

- Authentication: https://docs.easypost.com/docs/authentication
- Shipments and rates: https://docs.easypost.com/docs/shipments and https://docs.easypost.com/docs/shipments/rates
- Addresses: https://docs.easypost.com/docs/addresses
- Parcels: https://docs.easypost.com/docs/parcels
- Trackers: https://docs.easypost.com/docs/trackers
- Webhooks and HMAC guidance: https://docs.easypost.com/docs/webhooks
- Shipping refunds: https://docs.easypost.com/docs/shipments/shipping-refund
- Rate limiting/backoff: https://docs.easypost.com/guides/rate-limiting-guide

## Authentication and permissions

EasyPost authenticates API requests with an API key used as the Basic Authentication username and an empty password. Use a Test key for development and a Production key only where live shipping actions are intended. EasyPost API keys effectively provide account access rather than fine-grained OAuth scopes, so this connector applies its own least-privilege tool allowlist and risk policy.

Credentials stay inside the connector's credential provider and HTTP transport and are never returned in tool results. Set `EASYPOST_API_KEY` in the connector process environment. Do not place the key in an agent prompt.

## Installation and running

Requirements: Node.js 20+.

```bash
npm install
cp .env.example .env
# load environment variables using your process manager or shell
npm run build
npm start
```

The server uses MCP stdio transport, so any MCP client that supports stdio servers can launch it as a child process. Compatibility depends on the client's MCP/stdio support; no client-specific protocol extensions are required.

## Environment variables

- `EASYPOST_API_KEY` — required EasyPost Test or Production API key.
- `EASYPOST_API_BASE` — defaults to `https://api.easypost.com/v2`.
- `EASYPOST_REQUEST_TIMEOUT_MS` — request timeout, default 15000.
- `EASYPOST_MAX_READ_RETRIES` — bounded retries for GET requests only, default 3.
- `EASYPOST_REQUIRE_WRITE_APPROVAL` — default `true`.
- `EASYPOST_DESTRUCTIVE_ENABLED` — default `false`.
- `EASYPOST_ALLOWED_API_HOSTS` — host allowlist for SSRF protection; default `api.easypost.com`.

## Tool catalog

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---:|---|---|
| `easypost.address.list` | REST | READ | No | List addresses with pagination. |
| `easypost.address.get` | REST | READ | No | Read an address. |
| `easypost.address.create` | REST | WRITE | Configurable | Create immutable address. |
| `easypost.address.create_and_verify` | REST | WRITE | Configurable | Create and verify an address. |
| `easypost.parcel.get` | REST | READ | No | Read parcel metadata. |
| `easypost.parcel.create` | REST | WRITE | Configurable | Create immutable parcel. |
| `easypost.shipment.list` | REST | READ | No | List shipments. |
| `easypost.shipment.get` | REST | READ | No | Read shipment and rates/status. |
| `easypost.shipment.create` | REST | WRITE | Configurable | Create shipment from existing address/parcel IDs and obtain rates. |
| `easypost.shipment.buy` | REST | HIGH_RISK | Required | Purchase postage/label using a chosen rate. |
| `easypost.shipment.refund` | REST | HIGH_RISK | Required | Submit a carrier refund request. |
| `easypost.tracker.list` | REST | READ | No | Search/list trackers. |
| `easypost.tracker.get` | REST | READ | No | Read tracking status/history. |
| `easypost.tracker.create` | REST | WRITE | Configurable | Create standalone tracking. |
| `easypost.tracker.delete` | REST | DESTRUCTIVE | Required + enabled | Permanently delete tracker and stop related future events. |
| `easypost.webhook.list` | REST | READ | No | List webhooks. |
| `easypost.webhook.get` | REST | READ | No | Read webhook metadata. |
| `easypost.webhook.create` | REST | HIGH_RISK | Required | Create an HTTPS external event destination. |
| `easypost.webhook.delete` | REST | DESTRUCTIVE | Required + enabled | Permanently delete webhook. |

The connector intentionally does not expose an unrestricted arbitrary HTTP/API-request tool.

## Real-world workflow

A common shipping flow is: create/verify destination and origin addresses → create a parcel → create a shipment to obtain carrier rates → inspect rates returned by EasyPost → request explicit human approval → call `easypost.shipment.buy` with the selected `rate_id` → monitor the resulting tracker. The examples directory also contains machine-readable calls and expected output shapes.

## Approval model

`READ` operations execute without approval. `WRITE` operations require `approved=true` when `EASYPOST_REQUIRE_WRITE_APPROVAL=true` (the default). `HIGH_RISK` operations always require explicit approval. `DESTRUCTIVE` operations require explicit approval and are blocked entirely unless `EASYPOST_DESTRUCTIVE_ENABLED=true`.

The `approved` argument is an execution assertion from the MCP host/orchestrator; callers should only set it after a human has reviewed the exact action, target IDs, and financial/external effects. The connector cannot silently upgrade its own permissions.

## Reliability, pagination, and rate limits

EasyPost documents load-based limiting and endpoint-specific controls; its rate-limiting guide gives an example limit of five requests per second across Index/list endpoints. A `429` is treated as throttling. This client preserves `Retry-After` when present and uses bounded exponential backoff for safe GET requests. GET requests may also retry transient 5xx/network failures. POST and DELETE requests are never automatically retried, preventing duplicate purchases, refund submissions, tracker creation, webhook creation, or destructive actions.

List tools expose EasyPost cursor fields such as `before_id`, `after_id`, and `page_size`, bounded to the documented maximum of 100. The connector returns one provider page per call so an agent cannot trigger unbounded background pagination.

## Error handling

Provider HTTP errors are mapped to sanitized connector errors. Authentication/permission/validation failures are not retried. Requests have an AbortController timeout. EasyPost response content is wrapped with `untrusted_data: true`; provider text must be treated as data rather than instructions.

## Security considerations

- API keys remain inside the auth/client layer and are never included in MCP responses or logs by this implementation.
- API base overrides require HTTPS and an explicit host allowlist, reducing SSRF risk.
- Tool names map to fixed provider paths; there is no arbitrary URL or arbitrary endpoint tool.
- Strict Zod schemas constrain IDs, pagination, dimensions, addresses, money format, and webhook URLs.
- `shipment.buy` is financially consequential and requires explicit human approval.
- Webhook creation requires HTTPS and explicit approval because it sends EasyPost account events to an external destination.
- EasyPost recommends HMAC webhook validation by configuring a `webhook_secret`; receiving applications should validate `X-Hmac-Signature` before trusting events.
- Tracker and webhook deletion are disabled by default.
- EasyPost API data, carrier messages, tracking descriptions, labels, and webhook-derived content are untrusted external data and must not be interpreted as agent instructions.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch` and no live credentials. They cover safe configuration, SSRF host checks, credential injection at the transport boundary, risk/approval denial, throttled-read retry behavior, non-retry of writes, and tool registration.

## Limitations

This connector intentionally implements a high-value subset of EasyPost rather than every endpoint. It does not manage billing, users, carrier-account credentials, pickups, customs objects, insurance purchases, batches, reports, or raw events. Shipment creation is deliberately constrained to already-created EasyPost Address and Parcel IDs to keep the tool contract predictable. International shipment customs flows require additional EasyPost objects and are therefore outside this version. No unofficial upstream MCP server is used.
