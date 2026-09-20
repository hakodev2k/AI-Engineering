# NetBird MCP/API Connector

Reusable MCP server exposing a deliberately scoped subset of the official NetBird Public REST API for agent workflows. It supports NetBird Cloud and configurable self-hosted Management API origins.

## Upstream and research

Official sources checked on 2026-09-20:

- Public API: https://docs.netbird.io/api
- Authentication: https://docs.netbird.io/api/guides/authentication
- Service users/PATs: https://docs.netbird.io/manage/public-api
- Access-control concepts: https://docs.netbird.io/manage/access-control/manage-network-access

NetBird documents a Public REST API and OAuth2/PAT authentication. No official NetBird MCP server was found in the official API documentation checked for this connector, so all implemented capabilities use the official REST API. No unofficial MCP dependency is used.

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `netbird.peer.list` | REST `GET /api/peers` | READ | No |
| `netbird.peer.get` | REST `GET /api/peers/{id}` | READ | No |
| `netbird.group.list` | REST `GET /api/groups` | READ | No |
| `netbird.group.get` | REST `GET /api/groups/{id}` | READ | No |
| `netbird.group.create` | REST `POST /api/groups` | HIGH_RISK | Yes |
| `netbird.group.update` | REST `PUT /api/groups/{id}` | HIGH_RISK | Yes |
| `netbird.policy.list` | REST `GET /api/policies` | READ | No |
| `netbird.policy.get` | REST `GET /api/policies/{id}` | READ | No |
| `netbird.event.list` | REST `GET /api/events` | READ | No |
| `netbird.setup_key.list` | REST `GET /api/setup-keys` | READ | No |

Deletion, user administration, token creation, setup-key creation, policy mutation, network mutation, billing and arbitrary API forwarding are intentionally not exposed. Access-control group writes are HIGH_RISK because changing membership can change network reachability.

## Architecture

MCP client -> stdio MCP server -> validation/permission/approval boundary -> NetBird client -> official REST API. Credentials exist only in the connector process environment and are never MCP parameters. Provider responses are explicitly marked as untrusted data.

## Authentication

Use a service user where practical. `NETBIRD_AUTH_TYPE=pat` sends `Authorization: Token ...`; `NETBIRD_AUTH_TYPE=oauth2` sends `Authorization: Bearer ...`. The connector never returns the configured credential. For MSP tenant scoping, `NETBIRD_ACCOUNT_ID` is added as the documented `account` query parameter.

NetBird Cloud documents a limit of 120 requests/minute with a burst of 1200. This connector retries only idempotent GET requests, at most `NETBIRD_MAX_RETRIES` times, honoring numeric `Retry-After` and otherwise using bounded exponential backoff. It does not blindly retry writes, authentication failures, permission failures, or validation errors.

## Configuration

Copy `.env.example` values into your process environment. Required: `NETBIRD_TOKEN`. `NETBIRD_API_URL` defaults to `https://api.netbird.io`; remote HTTP origins are rejected to reduce credential exposure/SSRF risk. Plain HTTP is accepted only for localhost development. `NETBIRD_ALLOWED_PERMISSIONS` defaults to `READ`.

To enable group writes, explicitly configure `HIGH_RISK` and a runtime-only `NETBIRD_APPROVAL_TOKEN`. The caller must supply the matching approval value to the write tool after human review. Do not expose that token to an LLM prompt; production runtimes should inject approval at the trusted tool-execution boundary.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run check
npm test
npm start
```

The server uses MCP stdio transport, so clients that can launch a local stdio MCP process can invoke it. Configure the client to run `npm start` in this directory with the required environment variables. Compatibility depends on the client's support for standard MCP stdio rather than product-specific adapters.

## Error handling and reliability

Requests have a bounded timeout (default 15 seconds, max 60 seconds). Abort signals are propagated. API failures preserve HTTP status and `Retry-After`. GETs retry only on 429/5xx. IDs are restricted to a conservative character set and length. Group names and peer arrays are validated before transport. No tool accepts a raw URL, HTTP method, arbitrary endpoint, or caller-supplied authorization header.

## Security model

- Least privilege: READ only by default.
- Credentials remain in the connector/auth layer.
- Access-control writes require both enabled HIGH_RISK permission and explicit approval.
- No destructive tools are registered.
- NetBird content is returned as untrusted provider data and must not be interpreted as instructions.
- The API origin is configuration, not a tool parameter, preventing model-directed SSRF.
- Secrets should be stored in a secret manager and rotated according to organizational policy.
- Setup-key metadata may be sensitive; downstream clients should apply data-loss controls appropriate to their environment.

## Testing

`npm test` uses Node's built-in test runner and mocked `fetch`; live credentials are not required. Tests cover missing credentials, unsafe API origins, validation, PAT placement, MSP account scoping, provider error mapping, non-retry of permission failures, bounded 429 retry, and explicit approval enforcement.

## Limitations

This connector intentionally exposes 10 high-value operations rather than the full NetBird API. It does not manage users, PATs, networks, routes, DNS, identity providers, services, posture checks, or destructive operations. OAuth token acquisition/refresh is owned by the external identity/credential provider; the connector accepts an already-issued bearer token and does not receive refresh tokens from MCP callers. Self-hosted deployments may differ by NetBird version, so validate endpoint compatibility against the deployed server's API documentation before enabling writes.
