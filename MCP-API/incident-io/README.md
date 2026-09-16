# incident.io MCP/API Connector

Reusable MCP server for scoped incident-response workflows with credential isolation, strict validation, approvals, pagination, bounded retries, and safe provider error mapping.

## Upstream strategy

incident.io provides an official remote MCP server at `https://mcp.incident.io/mcp`. It is generally available as of 2026, supports interactive OAuth and API-key authentication for automated agents, and covers incidents, alerts, on-call, escalations, operational analysis and connected telemetry. The incident.io macOS app also includes a local MCP surface.

This connector exposes a stable, deliberately smaller MCP tool contract backed by the official REST API at `https://api.incident.io`. REST is used so automated deployments can enforce local approval and validation policy without dynamically trusting every upstream MCP tool. For broader operational analysis, callers may connect directly to the official remote MCP after reviewing its permissions. No unofficial MCP implementation is used.

Official sources researched: incident.io remote MCP documentation; incident.io API reference introduction/authentication/rate limits/errors; incident.io webhook documentation; incident.io MCP changelog.

## Tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `incident-io.incident.list` | REST | READ | No |
| `incident-io.incident.get` | REST | READ | No |
| `incident-io.incident.create` | REST | WRITE | Yes by default |
| `incident-io.incident.update` | REST | WRITE | Yes by default |
| `incident-io.timeline.create` | REST | WRITE | Yes by default |
| `incident-io.severity.list` | REST | READ | No |
| `incident-io.incident_type.list` | REST | READ | No |
| `incident-io.action.list` | REST | READ | No |
| `incident-io.follow_up.list` | REST | READ | No |

Destructive actions, incident deletion, permission changes, escalation execution, external messaging, status-page publishing and arbitrary API requests are not exposed.

## Authentication and permissions

Set `INCIDENT_IO_API_KEY` to an incident.io API key. Requests use `Authorization: Bearer`. Keys are created in Settings → API keys and can be assigned account-level and/or team-scoped permissions. Grant only permissions needed by the implemented tools. API keys remain inside the connector and are never accepted as tool parameters.

The official remote MCP uses OAuth for human interactive use; actions inherit that user's permissions. Automated MCP clients can authenticate with a scoped API key as a service actor. API keys do not expire until deleted.

## Permission and approval model

READ may execute automatically. WRITE requires `approved: true` when `INCIDENT_IO_APPROVAL_MODE=write` (default). The host must supply approval only after a trusted human reviews the exact final action; an LLM must not self-approve. DESTRUCTIVE operations are disabled and unregistered. The connector cannot raise its own privileges.

## Reliability and rate limits

incident.io documents a default API limit of 1,200 requests per minute per API key, with lower limits for some endpoints involving external systems. HTTP 429 responses include rate-limit metadata and a retry time. This connector retries only GET requests on 429/transient 5xx responses, honors Retry-After/rate-limit retry timestamps, and uses bounded exponential backoff otherwise. Writes are never blindly retried. Requests have configurable AbortController timeouts and list tools expose bounded cursor pagination.

## Errors

The API uses standard HTTP status codes and structured JSON errors containing type/status/request ID/errors. The connector returns a sanitized MCP error with status and retry metadata. Authentication, authorization and validation failures are not retried. Tokens are never returned or logged.

## Security

The provider base URL is constant and IDs are validated and URI encoded, preventing caller-selected arbitrary hosts and reducing SSRF risk. Provider content is marked `untrustedProviderData`; incident descriptions, timelines and metadata must never be treated as system instructions. No generic HTTP proxy exists. Credentials are isolated in environment configuration. Unexpected MCP tools or permission requests should fail closed.

incident.io webhooks use Svix-compatible signatures over webhook ID, timestamp and raw body; delivery can be retried and events may arrive out of order. Webhook registration/receiving is intentionally host responsibility and is not exposed as an agent tool. Consumers should verify signatures and fetch current API state rather than relying on webhook ordering. Private-incident webhook payloads may contain only an ID and require appropriately scoped API access to fetch details.

## Install and run

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# load secrets through your shell or secret manager
npm start
```

The generated server uses MCP stdio and works with MCP hosts that support launching local stdio child processes. The official remote MCP can instead be configured directly by clients that support remote HTTP MCP.

## Testing

Run `npm test`. Unit tests use mocks and require no live credentials. They cover authentication configuration, registration, write approval denial/allow, rate-limit retry behavior, credential isolation, and unsafe identifier validation.

## Limitations

This connector intentionally implements a focused incident-response API surface rather than every incident.io endpoint or every official MCP capability. It does not manage on-call schedules, execute escalations, publish status pages, delete resources, administer API keys, or query connected observability telemetry. Those capabilities should use the official remote MCP or separately reviewed official API endpoints with appropriate approval policy.
