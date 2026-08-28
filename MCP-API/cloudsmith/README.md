# Cloudsmith MCP/API Connector

Security-focused reusable MCP connector for Cloudsmith artifact management and software supply-chain workflows.

## Provider and transport

Cloudsmith provides an **official local MCP server** through the Cloudsmith CLI. Cloudsmith announced early access on November 10, 2025 and documented CLI MCP support on March 2, 2026. The official MCP implementation currently focuses on core repository and package management; advanced policies and usage metrics were documented as still in development.

This connector uses the **official Cloudsmith REST API** as its upstream transport. That keeps a stable reviewed external MCP contract, explicit human-approval gates, metrics support, bounded retries, destructive-operation controls, and no dynamic upstream tool discovery. It does not depend on an unofficial MCP implementation.

Official sources researched on 2026-08-28:

- Cloudsmith MCP product: https://cloudsmith.com/product/mcp-server
- Cloudsmith MCP CLI release: https://cloudsmith.com/changelog/manage-your-supply-chain-using-natural-language-with-mcp
- REST API reference: https://docs.cloudsmith.com/api
- API authentication: https://docs.cloudsmith.com/api
- API key guidance: https://docs.cloudsmith.com/accounts-and-teams/api-key
- Rate limits: https://docs.cloudsmith.com/api/rate-limits
- Namespaces: https://docs.cloudsmith.com/api/namespaces/list
- Repositories: https://docs.cloudsmith.com/api/repos/namespace/list
- Packages list/read: https://docs.cloudsmith.com/api/packages/list and https://docs.cloudsmith.com/api/packages/read
- Package dependencies: https://docs.cloudsmith.com/api/packages/dependencies
- Package copy/move/delete/quarantine: https://docs.cloudsmith.com/api/packages/copy, https://docs.cloudsmith.com/api/packages/move, https://docs.cloudsmith.com/api/packages/delete, https://docs.cloudsmith.com/api/packages/quarantine
- Package vulnerabilities: https://docs.cloudsmith.com/api/vulnerabilities/package/list
- Package metrics: https://docs.cloudsmith.com/api/metrics/packages/list

## Supported capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---|---|
| `cloudsmith.namespace.list` | REST | READ | no |
| `cloudsmith.repository.list` | REST | READ | no |
| `cloudsmith.package.list` | REST | READ | no |
| `cloudsmith.package.get` | REST | READ | no |
| `cloudsmith.package.dependencies` | REST | READ | no |
| `cloudsmith.package.vulnerabilities` | REST | READ | no |
| `cloudsmith.package.metrics` | REST | READ | no |
| `cloudsmith.package.copy` | REST | WRITE | yes |
| `cloudsmith.package.move` | REST | HIGH_RISK | yes |
| `cloudsmith.package.quarantine` | REST | HIGH_RISK | yes |
| `cloudsmith.package.release` | REST | HIGH_RISK | yes |
| `cloudsmith.package.delete` | REST | DESTRUCTIVE | yes + feature flag |

Cloudsmith package quarantine blocks downloads until the package is released, so quarantine/release are treated as high-risk operations because they can directly affect builds and production availability.

## Architecture

```text
MCP client / AI agent
        |
        v
Cloudsmith connector (stdio MCP)
  - strict tool allowlist
  - strict JSON schemas
  - approval/policy layer
  - bounded retry policy
  - provider-data trust boundary
        |
        v
Credential-isolated REST client
        |
        v
Cloudsmith REST API
```

Provider-returned content is wrapped with `untrusted_provider_data: true`. Package names, descriptions, metadata, dependency information and vulnerability content are data, not instructions, and must not change connector permissions or agent policy.

## Authentication

Set `CLOUDSMITH_API_KEY`. Requests use the documented header:

```text
Authorization: token <api-key>
```

Cloudsmith entitlement tokens cannot authenticate to the Cloudsmith API; they are for package downloads only.

Prefer a dedicated Cloudsmith service account or principal whose repository privileges are no broader than the implemented workflows require. Cloudsmith warns that API keys carry the rights of their principal, so they must be treated as secrets and kept out of model prompts and tool arguments.

## Environment variables

```text
CLOUDSMITH_API_KEY=
CLOUDSMITH_API_BASE_URL=https://api.cloudsmith.io
CLOUDSMITH_TIMEOUT_MS=10000
CLOUDSMITH_MAX_RETRIES=3
CLOUDSMITH_APPROVAL_SECRET=
CLOUDSMITH_ENABLE_DESTRUCTIVE=false
```

`CLOUDSMITH_API_BASE_URL` must be an HTTPS origin without embedded credentials, path, query, or fragment. Credentials remain inside the connector process.

## Installation

Node.js 20+ is required.

```bash
npm install
npm run check
npm test
```

## Running the MCP server

```bash
npm start
```

The connector uses MCP stdio transport. Any MCP host that supports standard stdio tool discovery and calls can use it without Cloudsmith-specific client extensions.

## Permission and approval model

READ tools may execute automatically.

WRITE and HIGH_RISK tools require `CLOUDSMITH_APPROVAL_SECRET` plus an `approval_token` bound to the exact tool and exact payload:

```text
hex(HMAC-SHA256(
  CLOUDSMITH_APPROVAL_SECRET,
  "<tool-name>\n<stable canonical JSON payload without approval_token>"
))
```

This means approval for one repository, package, destination, quarantine action, or republish mode cannot be silently reused for another payload.

DESTRUCTIVE tools additionally require:

```text
CLOUDSMITH_ENABLE_DESTRUCTIVE=true
```

The agent cannot enable this through a tool call.

## Reliability and rate limits

Cloudsmith documents these baseline API limits:

- anonymous API: 1,800 requests/hour;
- authenticated Core: 5,400 requests/hour;
- authenticated Pro, Velocity, Ultra, or Enterprise: 50,000 requests per 5 minutes.

Cloudsmith exposes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `X-RateLimit-Interval`; throttled requests return HTTP 429 and `Retry-After`.

The connector:

- captures rate-limit and pagination metadata;
- bounds request duration with a configurable timeout;
- propagates cancellation;
- retries only retry-safe reads on network errors and HTTP 429/502/503/504;
- honors bounded numeric `Retry-After` values;
- uses exponential backoff otherwise;
- never blindly retries copy, move, quarantine, release, or delete;
- does not retry authentication, permission, or validation failures as transient errors.

## Error handling

Provider errors are normalized at the MCP boundary. Authentication/permission errors remain non-retryable. Rate-limit errors retain rate-limit metadata. Provider 5xx responses are marked retryable for callers, while this connector still avoids automatic mutation replay.

## Real-world workflows

A typical supply-chain investigation can be:

```text
namespace.list
 -> repository.list
 -> package.list
 -> package.get
 -> package.dependencies
 -> package.vulnerabilities
 -> package.metrics
```

A security response can then prepare and explicitly approve:

```text
package.quarantine
```

A promotion workflow can inspect a staging artifact and, after approval, use:

```text
package.copy
```

Package move is treated as HIGH_RISK because it changes source placement. Package delete is DESTRUCTIVE and disabled by default.

See `examples/workflows.md` for concrete tool inputs and output shapes.

## Security considerations

- The API key is never accepted as a tool argument and is never returned in tool output.
- No arbitrary HTTP-request tool is exposed.
- No API-key, user, team, role, billing, or permission-management tools are exposed.
- No repository deletion or policy activation tools are exposed.
- All writes require payload-bound approval.
- Permanent deletion is disabled by default.
- Package move/quarantine/release are HIGH_RISK because they can disrupt artifact availability.
- Page sizes are bounded to reduce accidental high-volume requests.
- Base URL validation reduces SSRF risk.
- Retrieved content is marked untrusted and cannot modify permissions.
- Upstream MCP tool discovery is not forwarded or automatically trusted.

## Testing

Unit tests do not require live Cloudsmith credentials. They cover:

- tool registration and policy synchronization;
- required authentication configuration;
- payload-bound approval;
- destructive-operation denial;
- Cloudsmith token authentication header;
- pagination and rate-limit header parsing;
- safe read retry on HTTP 429;
- prevention of blind mutation retries.

Run:

```bash
npm test
```

## Limitations

- Artifact upload/publish is intentionally omitted. Large binary transfer is better handled by CI, the Cloudsmith CLI, or native package tooling.
- Repository creation/deletion and governance-policy activation are omitted to keep infrastructure and governance changes outside normal agent authority.
- Metrics and vulnerability capabilities can depend on Cloudsmith plan and repository permissions.
- The official Cloudsmith MCP server may expose additional evolving functionality; this connector deliberately keeps a fixed reviewed tool surface.
- This connector does not expose entitlement-token values, API-key lifecycle operations, or arbitrary provider requests.
