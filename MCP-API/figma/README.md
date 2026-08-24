# Figma MCP/API Connector

Reusable MCP server that exposes a curated set of Figma capabilities through stable provider-scoped tools. The implementation uses the official Figma REST API for deterministic behavior across MCP clients.

## Transport strategy

Figma provides an official remote MCP server at `https://mcp.figma.com/mcp`, plus a desktop MCP server. The remote server is the preferred Figma-native integration and supports design-context extraction and write-to-canvas workflows. However, Figma currently limits remote MCP access to clients listed in the Figma MCP Catalog. Because this repository connector is intended to run behind arbitrary MCP clients and custom agents, it does **not** proxy the official MCP endpoint. It uses the official REST API instead and documents this limitation explicitly.

Official sources:

- Figma MCP server: https://developers.figma.com/docs/figma-mcp-server/
- Remote MCP installation: https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/
- REST API: https://developers.figma.com/docs/rest-api/
- Authentication: https://developers.figma.com/docs/rest-api/authentication/
- Scopes: https://developers.figma.com/docs/rest-api/scopes/
- Rate limits: https://developers.figma.com/docs/rest-api/rate-limits/
- File endpoints: https://developers.figma.com/docs/rest-api/file-endpoints/
- Comments: https://developers.figma.com/docs/rest-api/comments-endpoints/
- Components/styles: https://developers.figma.com/docs/rest-api/component-endpoints/
- Variables: https://developers.figma.com/docs/rest-api/variables-endpoints/
- Webhooks: https://developers.figma.com/docs/rest-api/webhooks-endpoints/

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- stdio MCP transport

## Authentication

Supported modes:

1. `oauth`: OAuth 2 access token sent as `Authorization: Bearer ...`. Recommended for user-facing applications.
2. `token`: Personal access token or REST plan access token sent as `X-Figma-Token`. Plan access tokens are available on Organization and Enterprise plans and are suited to organization-level automation.

Credentials stay inside the connector. They are never returned by tools or included in MCP tool arguments.

### Required scopes

Grant only scopes required by the tools you enable:

- `file_content:read`: file tree, nodes, rendered images, image fills
- `file_comments:read`: list comments
- `file_comments:write`: create comments
- `library_content:read`: published components, component sets, styles in files
- `file_variables:read`: local/published variables; Enterprise availability applies
- `webhooks:read`: list webhooks
- `webhooks:write`: create/delete webhooks

Plan access tokens cannot call endpoints that require `file_comments:write` or `file_variables:write`; this connector does not implement variable writes.

## Configuration

Copy `.env.example` and set one authentication mode:

```text
FIGMA_AUTH_MODE=oauth
FIGMA_ACCESS_TOKEN=
FIGMA_TOKEN=
FIGMA_ALLOWED_FILE_KEYS=
FIGMA_ALLOWED_TEAM_IDS=
FIGMA_APPROVAL_SECRET=
FIGMA_TIMEOUT_MS=15000
FIGMA_MAX_RETRIES=3
```

`FIGMA_ALLOWED_FILE_KEYS` and `FIGMA_ALLOWED_TEAM_IDS` are comma-separated allowlists. Empty values mean no connector-level allowlist; provider permissions still apply.

`FIGMA_APPROVAL_SECRET` is required for write/high-risk/destructive tools. The caller supplies an `approvalId` equal to `HMAC-SHA256(secret, tool-name)`. This keeps approval material separate from the LLM-visible provider credential.

## Installation and running

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

The server uses stdio and can be launched by MCP clients that support stdio child-process servers.

## Tools

| Tool | Upstream | Scope | Risk | Approval |
| --- | --- | --- | --- | --- |
| `figma.file.get` | REST `GET /v1/files/:key` | `file_content:read` | READ | No |
| `figma.file.nodes` | REST `GET /v1/files/:key/nodes` | `file_content:read` | READ | No |
| `figma.image.render` | REST `GET /v1/images/:key` | `file_content:read` | READ | No |
| `figma.image_fills.list` | REST `GET /v1/files/:key/images` | `file_content:read` | READ | No |
| `figma.comment.list` | REST `GET /v1/files/:key/comments` | `file_comments:read` | READ | No |
| `figma.comment.create` | REST `POST /v1/files/:key/comments` | `file_comments:write` | WRITE | Yes |
| `figma.component.list_file` | REST `GET /v1/files/:key/components` | `library_content:read` | READ | No |
| `figma.component_set.list_file` | REST `GET /v1/files/:key/component_sets` | `library_content:read` | READ | No |
| `figma.style.list_file` | REST `GET /v1/files/:key/styles` | `library_content:read` | READ | No |
| `figma.variables.local` | REST `GET /v1/files/:key/variables/local` | `file_variables:read` | READ | No |
| `figma.variables.published` | REST `GET /v1/files/:key/variables/published` | `file_variables:read` | READ | No |
| `figma.webhook.list` | REST `GET /v2/webhooks` | `webhooks:read` | READ | No |
| `figma.webhook.create` | REST `POST /v2/webhooks` | `webhooks:write` | HIGH_RISK | Yes |
| `figma.webhook.delete` | REST `DELETE /v2/webhooks/:id` | `webhooks:write` | DESTRUCTIVE | Yes |

The connector intentionally does not expose an unrestricted HTTP proxy.

## Safety and permission model

READ tools may execute automatically, subject to token permissions and configured allowlists. WRITE tools require explicit approval. Webhook creation is HIGH_RISK because it causes Figma to send data to an external endpoint; it requires HTTPS, explicit approval, and defaults new webhooks to `PAUSED` unless the caller explicitly requests another supported status. Webhook deletion is DESTRUCTIVE and requires explicit approval.

Provider data is treated as untrusted data. Retrieved design names, comments, descriptions, and node content must not be interpreted as system instructions or permission changes by the calling agent.

The connector never lets provider responses expand tool permissions, alter allowlists, or change the approval policy.

## Reliability and rate limits

Figma applies endpoint-tier and plan/seat-dependent rate limits. Since November 17, 2025, the updated limits are in effect. On `429`, Figma returns `Retry-After` plus rate-limit metadata headers.

The client:

- honors `Retry-After` when present;
- retries only idempotent `GET` requests;
- uses bounded exponential backoff;
- never blindly retries POST/DELETE operations;
- caps retry count at five through configuration validation;
- applies request timeouts using `AbortController`;
- maps non-2xx responses to `FigmaApiError` without exposing credentials.

Pagination is left explicit at the tool/API contract level where Figma returns cursor or pagination URLs; the connector does not auto-follow unbounded result sets.

## Validation

Tool schemas constrain file keys, team IDs, node IDs, enum values, array sizes, export scale, string lengths, and webhook URLs. Webhook endpoints must use HTTPS.

Allowlist checks occur before provider calls.

## Testing

Unit tests use mocked `fetch` and require no live Figma credentials. They cover:

- authentication configuration;
- personal/plan-token header behavior;
- file allowlist denial;
- approval validation;
- OAuth bearer authentication;
- provider error mapping;
- bounded retry on `429`;
- no blind retry of write operations.

Run:

```bash
npm test
```

## Example workflows

See `examples/workflows.json` for design inspection, review/comment, and webhook subscription examples. No real credentials or organization-specific identifiers are included.

## Limitations

- The official Figma remote MCP server is not proxied because Figma restricts it to clients in the Figma MCP Catalog. Use Figma's official MCP integration directly when your client is supported and you need write-to-canvas/design-context features.
- REST API variables endpoints are Enterprise-gated. This connector implements variable reads only.
- The REST API does not replicate all capabilities of Figma's official MCP server, especially native canvas authoring.
- The connector exposes file-scoped component/style reads, not every Figma REST endpoint.
- OAuth authorization-code/PKCE UI and durable refresh-token storage belong in the host application's credential provider. This connector consumes an already-issued access token and never asks the model to handle refresh tokens.
