# Shippo MCP/API Connector

Reusable MCP server for Shippo shipping workflows. It exposes scoped MCP tools while keeping the Shippo API token inside the connector.

## Upstream transport and official sources

Shippo publishes an official hosted MCP server at `https://mcp.shippo.com` with per-user OAuth. Shippo also publishes the official REST API at `https://api.goshippo.com`. This connector intentionally uses the REST API for its service-to-service runtime so credentials remain local and the connector can enforce its own stable tool contracts and approval boundaries. It does not proxy an unofficial MCP server.

Official references used for this implementation:
- Shippo MCP: `https://docs.goshippo.com/docs/mcp/`
- API reference: `https://docs.goshippo.com/shippoapi/public-api/`
- Authentication: `https://docs.goshippo.com/docs/api_concepts/authentication/`
- Versioning: `https://docs.goshippo.com/docs/api_concepts/versioning/`
- Rate limits: `https://docs.goshippo.com/docs/api_concepts/ratelimits/`
- Webhooks: `https://docs.goshippo.com/docs/tracking/webhooks/`

## Capabilities

Sixteen tools cover address and parcel lookup/creation, shipment creation/list/read, rate inspection, label purchase, transaction lookup/list, refund request/status, and tracking lookup. The connector deliberately does not expose an arbitrary HTTP-request tool.

| Tool | Risk | Approval |
|---|---|---|
| `shippo.address.get` | READ | no by default |
| `shippo.address.list` | READ | no by default |
| `shippo.address.create` | WRITE | configurable; yes by default |
| `shippo.parcel.get` | READ | no by default |
| `shippo.parcel.list` | READ | no by default |
| `shippo.parcel.create` | WRITE | configurable; yes by default |
| `shippo.shipment.create` | WRITE | configurable; yes by default |
| `shippo.shipment.get` | READ | no by default |
| `shippo.shipment.list` | READ | no by default |
| `shippo.rate.get` | READ | no by default |
| `shippo.label.purchase` | HIGH_RISK | always explicit |
| `shippo.transaction.get` | READ | no by default |
| `shippo.transaction.list` | READ | no by default |
| `shippo.refund.request` | DESTRUCTIVE | explicit + disabled by default |
| `shippo.refund.get` | READ | no by default |
| `shippo.track.get` | READ | no by default |

Label purchase is HIGH_RISK because it can incur postage charges. Refund request is DESTRUCTIVE because it changes the financial/operational state of an existing label and is disabled unless `SHIPPO_ALLOW_DESTRUCTIVE=true`.

## Architecture

`src/config.ts` validates configuration; `src/security.ts` enforces risk and approval policy; `src/client.ts` owns credentials, HTTPS/API transport, timeouts, cancellation, retry and rate-limit handling; `src/tools.ts` defines scoped schemas and handlers; `src/server.ts` registers them on a standards-based MCP stdio server. Provider responses are wrapped as `untrusted-provider-data`; they are data, never instructions.

## Authentication and permissions

Create a Shippo API token with only the account access needed for the intended workflows. The REST API uses `Authorization: ShippoToken <token>`. The token is read from `SHIPPO_API_TOKEN` by the connector and is never accepted as a tool argument or returned to the MCP client. For user-delegated integrations, Shippo's official hosted MCP uses per-user OAuth; this package does not implement that OAuth flow.

Copy `.env.example` values into your secure runtime secret store. Do not commit credentials.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
SHIPPO_API_TOKEN=... npm start
```

The server uses MCP stdio transport, so standards-compatible MCP clients that support stdio can launch `node dist/index.js`. Client-specific configuration syntax varies; no compatibility is claimed for clients that do not support MCP stdio.

## Configuration

`SHIPPO_API_BASE_URL` defaults to the official HTTPS API origin and non-HTTPS origins are rejected. `SHIPPO_API_VERSION` defaults to `2018-02-08`; override it only after validating behavior against Shippo's versioning documentation. `SHIPPO_TIMEOUT_MS` defaults to 15000. `SHIPPO_MAX_RETRIES` defaults to 2 and is capped at 5. `SHIPPO_APPROVAL_MODE` is `writes` by default (`none`, `writes`, `all`). `SHIPPO_ALLOW_DESTRUCTIVE` defaults to false.

## Reliability and rate limits

All requests have bounded timeouts and accept cancellation internally. GET/HEAD operations retry transient network failures, HTTP 429 and 5xx with bounded exponential backoff; `Retry-After` is honored when present. Write, high-risk, and destructive requests are not automatically retried because duplicate execution can create resources or incur charges. Pagination is explicit and bounded to 100 results per request.

Shippo applies endpoint-specific rate limiting; this connector does not invent a universal quota. A 429 is surfaced if bounded retries are exhausted.

## Error handling

Validation and permission failures are never retried. Authentication/authorization failures from Shippo are surfaced for user action. Provider errors include HTTP status and a bounded response excerpt; credentials are not logged. Timeouts and cancellations map to explicit connector errors.

## Security considerations

Credentials remain in the client/auth boundary. URLs are built from fixed relative paths and cross-origin requests are rejected, reducing SSRF exposure. IDs and free text are validated before path construction. Tool schemas are strict. Retrieved provider content is untrusted and cannot alter connector configuration, permissions, or approval state. HIGH_RISK and DESTRUCTIVE operations cannot be authorized by provider-returned content; the caller must supply an explicit `approved: true` after human approval.

For production, place the API token in a secret manager, isolate the connector process, redact MCP logs, and limit who can change environment variables. If consuming Shippo webhooks separately, validate the webhook origin/signature mechanism documented by Shippo and never treat payload content as agent instructions. Webhook receiver tools are not implemented in this package.

## Testing

```bash
npm test
```

Tests use mocked `fetch` and require no live Shippo credentials. They cover auth configuration, tool registration, read authentication, write/high-risk/destructive approval boundaries, rate-limit retry behavior, and ID validation.

## Examples

See `examples/workflows.md` for rate, purchase, tracking and refund workflows with expected output shapes and approval requirements.

## Limitations

This connector targets the documented Shippo REST resources listed above and does not expose every Shippo endpoint. It does not implement Shippo's hosted MCP OAuth client, webhook hosting, carrier-account administration, customs workflows, manifests, pickups, orders, or arbitrary provider requests. API behavior and account entitlements remain subject to Shippo's current product/API rules.
