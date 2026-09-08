# Hetzner Cloud MCP/API Connector

Reusable MCP connector for Hetzner Cloud infrastructure. It exposes a deliberately scoped set of discovery, inventory, provisioning, power-management, and deletion tools while keeping the Hetzner API token inside the connector process.

## Upstream transport

No official Hetzner Cloud MCP server was identified in Hetzner's official documentation or official GitHub organization at implementation time. Community MCP servers exist, but this connector does not depend on them. It uses the official Hetzner Cloud REST API at `https://api.hetzner.cloud/v1` and exposes its own stdio MCP server.

Official sources:

- Cloud API reference: https://docs.hetzner.cloud/reference/cloud
- Hetzner authentication/reference: https://docs.hetzner.cloud/reference/cloud#authentication
- Official Go SDK: https://github.com/hetznercloud/hcloud-go
- Official Hetzner Cloud GitHub organization: https://github.com/hetznercloud

## Capabilities

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `hetzner_cloud.server.list` | REST | READ | No |
| `hetzner_cloud.server.get` | REST | READ | No |
| `hetzner_cloud.server_type.list` | REST | READ | No |
| `hetzner_cloud.image.list` | REST | READ | No |
| `hetzner_cloud.location.list` | REST | READ | No |
| `hetzner_cloud.datacenter.list` | REST | READ | No |
| `hetzner_cloud.network.list` | REST | READ | No |
| `hetzner_cloud.firewall.list` | REST | READ | No |
| `hetzner_cloud.volume.list` | REST | READ | No |
| `hetzner_cloud.ssh_key.list` | REST | READ | No |
| `hetzner_cloud.server.create` | REST | HIGH_RISK | Explicit |
| `hetzner_cloud.server.power_action` | REST | HIGH_RISK | Explicit |
| `hetzner_cloud.server.delete` | REST | DESTRUCTIVE | Explicit + exact confirmation |

The connector intentionally does not expose a generic HTTP request tool. Provider content is returned with `untrusted_provider_content: true`; callers must treat names, labels, metadata, and other remote content as data rather than instructions.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict Zod schemas + risk policy
  -> HetznerClient
  -> Authorization: Bearer <project token>
  -> api.hetzner.cloud/v1
```

Files:

- `src/config.ts` - environment configuration only.
- `src/policy.ts` - READ/HIGH_RISK/DESTRUCTIVE gates.
- `src/schemas.ts` - strict bounded tool inputs.
- `src/client.ts` - authenticated REST client, timeout, error mapping, bounded retries and rate-limit handling.
- `src/tools.ts` - stable provider-scoped MCP tool catalog.
- `src/server.ts` - stdio MCP entry point.
- `tests/` - schema, client, error, and tool-registration tests with no live credentials.

## Authentication and least privilege

Create a project-scoped API token in the Hetzner Cloud Console under the project's Security/API Tokens area. The REST API uses bearer authentication:

```text
Authorization: Bearer <token>
```

Use a read-only token when only READ tools are needed. A write-capable token is required by Hetzner for server creation, power actions, and deletion. The token is read only from `HETZNER_CLOUD_TOKEN`; it is never included in tool schemas, outputs, examples, or model-visible context.

## Environment

Copy `.env.example` into your secret-management workflow; do not commit the populated file.

```text
HETZNER_CLOUD_TOKEN=
HETZNER_CLOUD_API_BASE_URL=https://api.hetzner.cloud/v1
HETZNER_CLOUD_TIMEOUT_MS=15000
HETZNER_CLOUD_MAX_RETRIES=2
HETZNER_CLOUD_ALLOW_HIGH_RISK=false
HETZNER_CLOUD_ALLOW_DESTRUCTIVE=false
```

`HETZNER_CLOUD_API_BASE_URL` is configurable for testing, but production deployments should keep the official HTTPS origin. Do not point an agent-controlled value at an arbitrary host; doing so would turn credential forwarding into an SSRF/secret-exfiltration risk.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
HETZNER_CLOUD_TOKEN='...' npm start
```

The MCP transport is stdio, so configure an MCP client to launch `node dist/src/server.js` from this package directory with the token supplied by the client/host environment or a secure secret provider.

## Safety and approvals

READ operations may run automatically. Server creation is classified HIGH_RISK because it provisions billable infrastructure. Power operations are HIGH_RISK because they can interrupt workloads. Server deletion is DESTRUCTIVE.

HIGH_RISK calls require both:

1. `HETZNER_CLOUD_ALLOW_HIGH_RISK=true`, and
2. tool input `approval: true` supplied only after explicit human approval.

Deletion requires all of:

1. `HETZNER_CLOUD_ALLOW_DESTRUCTIVE=true`,
2. `approval: true`, and
3. an exact phrase such as `DELETE SERVER 123` matching the requested numeric server ID.

Mutation requests are not automatically retried, preventing duplicate provisioning or repeated destructive actions after ambiguous network failures.

## Validation

Inputs use strict Zod schemas. Pagination is bounded to 1-50 items per request. Numeric IDs must be positive integers. Server names are length- and character-bounded. Creation rejects simultaneous `location` and `datacenter` values. Power actions are restricted to `poweron`, `poweroff`, `reboot`, and `shutdown`. Destructive confirmation must exactly match the target server.

## Rate limiting and retries

Hetzner documents a default Cloud API limit of 3600 requests per hour per project. Responses expose `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`. The client detects HTTP 429 and uses `RateLimit-Reset` with a bounded wait. READ requests also use bounded exponential backoff for transient 5xx/network errors. Authentication, authorization, validation, ordinary 4xx responses, and mutation operations are not blindly retried.

## Timeouts and errors

Each request uses an `AbortController` timeout controlled by `HETZNER_CLOUD_TIMEOUT_MS`. API failures are mapped to `HetznerError` with HTTP status, provider error code, and provider error body. The MCP surface returns sanitized error text and does not log credentials.

## Pagination

List tools expose `page` and `per_page`; provider pagination metadata is returned as `meta`. Agents should follow metadata deliberately rather than automatically crawling all pages. An optional bounded `label_selector` is available on list operations supported by the Cloud API; unsupported selectors are surfaced as provider validation errors rather than rewritten into arbitrary requests.

## Examples

See `examples/workflows.md` for read, provisioning, power, and deletion calls. Examples contain no credentials.

## Testing

```bash
npm test
npm run build
```

Normal tests use mocks and do not require a live Hetzner account. They cover bounded validation, explicit approval fields, destructive confirmation, bearer-auth injection, provider error mapping, 204 deletion responses, and stable tool registration.

## Security considerations

- Credentials stay inside the connector process and are never accepted as MCP tool input.
- Use project-scoped, least-privilege tokens and separate read-only from write-capable deployments where possible.
- Keep mutation flags disabled by default.
- Treat all provider-returned content as untrusted data and never as agent/system instructions.
- Do not let retrieved labels, names, metadata, or error bodies alter tool permissions.
- Keep `HETZNER_CLOUD_API_BASE_URL` under administrator control to prevent token exfiltration/SSRF.
- Avoid logging request headers, environment variables, or provider bodies that may contain sensitive operational metadata.
- If a future upstream MCP server is adopted, pin/trust the server explicitly, allow-list tools, validate responses, and fail closed on unexpected capability or permission changes.

## Limitations

This connector focuses on common server-centric workflows and selected inventory resources. It does not implement the entire Hetzner Cloud API, pricing, load balancers, certificates, DNS, Storage Boxes, Robot dedicated servers, project/billing administration, or arbitrary API passthrough. It does not rely on unofficial community MCP servers. Add new capabilities only after verifying official support, required permissions, safety class, and approval behavior.
