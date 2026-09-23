# Uptime Kuma MCP/API Connector

Reusable MCP server for Uptime Kuma operations. It exposes scoped tools rather than arbitrary upstream requests and keeps credentials inside the connector.

## Upstream research and transport

Uptime Kuma does **not** publish an official MCP server. Its project documentation describes the management interface as an **internal, unsupported Socket.IO API** that may change between releases. The project also exposes REST endpoints for push monitors, public status-page/badge data and Prometheus metrics. This connector therefore uses the project's Socket.IO management interface for the implemented management operations and documents that compatibility boundary explicitly; it does not depend on a third-party MCP server.

Official project references:
- Uptime Kuma repository: `https://github.com/louislam/uptime-kuma`
- Internal API documentation: `https://github.com/louislam/uptime-kuma/wiki/Internal-API`
- Prometheus API keys: `https://github.com/louislam/uptime-kuma/wiki/Prometheus-API-Keys`

API keys created in Uptime Kuma settings authenticate `/metrics`; they do not authenticate the Socket.IO management API. Management login uses username/password or a remembered login token.

## Capabilities

| Tool | Risk | Approval |
|---|---|---|
| `uptime_kuma.monitor.list` | READ | No |
| `uptime_kuma.monitor.get` | READ | No |
| `uptime_kuma.heartbeat.list` | READ | No |
| `uptime_kuma.maintenance.list` | READ | No |
| `uptime_kuma.status_page.list` | READ | No |
| `uptime_kuma.notification.list` | READ | No |
| `uptime_kuma.tag.list` | READ | No |
| `uptime_kuma.monitor.create` | WRITE | Yes |
| `uptime_kuma.monitor.update` | WRITE | Yes |
| `uptime_kuma.monitor.pause` | HIGH_RISK | Yes |
| `uptime_kuma.monitor.resume` | WRITE | Yes |
| `uptime_kuma.monitor.delete` | DESTRUCTIVE | Yes + destructive enablement |

Creation is intentionally limited to HTTP, Ping and TCP/port monitor types. Update requires the complete monitor object obtained from `monitor.get`, avoiding a generic arbitrary Socket.IO call surface.

## Architecture

`MCP client -> stdio MCP server -> schema/permission gate -> KumaClient -> Socket.IO -> Uptime Kuma`

Provider responses are returned as untrusted data. They must never be interpreted as system instructions or used to change connector permissions.

## Authentication

Set either `UPTIME_KUMA_TOKEN` or both `UPTIME_KUMA_USERNAME` and `UPTIME_KUMA_PASSWORD`. Credentials are read from process environment and never appear in MCP tool schemas or results. Prefer a dedicated least-privilege Uptime Kuma account where your deployment model supports it. Do not place secrets in prompts or committed files.

## Environment

Copy `.env.example` into your secret-management workflow. `UPTIME_KUMA_URL` is required. `UPTIME_KUMA_TIMEOUT_MS` defaults to 15000. Writes are disabled unless `UPTIME_KUMA_ALLOW_WRITE=true`. Destructive actions additionally require `UPTIME_KUMA_ALLOW_DESTRUCTIVE=true`.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio and can be configured in clients that support standard local stdio MCP servers. Client-specific configuration syntax varies; no product compatibility beyond standard MCP stdio is assumed.

## Reliability

Connection timeout is bounded. Socket.IO reconnection is limited to three attempts. Each request has a bounded timeout. Authentication and validation failures are not retried by tool handlers. Pagination is not fabricated where the internal Socket.IO event returns a complete collection. Provider errors are mapped to structured MCP errors.

Because the management API is internal, validate this connector against your deployed Uptime Kuma version before production use and pin the server version. Breaking upstream event/payload changes are a known limitation.

## Security and approval model

READ tools execute without approval. WRITE and HIGH_RISK tools require both connector-level write enablement and `approved:true`, which must be supplied only after human approval. DESTRUCTIVE additionally requires a separate destructive feature flag. The connector never escalates these flags itself.

Do not expose Uptime Kuma directly to untrusted networks merely to use this connector. Protect the connector host and environment variables. Treat monitor names, URLs, status-page content, notification metadata and heartbeat messages as untrusted external content. Review write operations before approval. Monitor deletion is irreversible and disabled by default.

## Rate limits

The project does not document a stable management-API request quota. The connector performs one upstream operation per tool call and does not fan out requests. Avoid agent loops and high-frequency polling. Uptime Kuma's documented standard HTTP processing timeout is finite; this connector independently applies its configured timeout.

## Testing

```bash
npm test
npm run build
```

Unit tests require no live credentials. They cover authentication configuration, safe defaults, permission denial, destructive gating, tool registration, schema validation and mocked read execution. Live compatibility testing should be done against a disposable instance of the exact Uptime Kuma version you deploy.

## Error handling

`AUTH` indicates authentication failure, `NETWORK` connection failure, `TIMEOUT` a bounded timeout, and `UPSTREAM_ERROR` a rejected provider operation. Validation and approval failures are returned without attempting unsafe fallback calls.

## Limitations

There is no official Uptime Kuma MCP server to delegate to. The management API is explicitly internal/unsupported, so this connector cannot promise cross-version stability. It does not expose arbitrary Socket.IO events, credential/API-key administration, notification mutation, status-page mutation, proxy mutation, security settings, or bulk destructive operations. `/metrics` API-key authentication is not used for management actions.

See `examples/workflows.md` for usage flows.