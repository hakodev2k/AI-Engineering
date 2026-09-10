# Vultr MCP/API Connector

Reusable, security-focused MCP server for Vultr cloud infrastructure. The connector exposes a stable `vultr.*` tool surface while keeping Vultr credentials, permission decisions, retries, and provider transport inside the connector process.

## Provider and transport strategy

Vultr has an official MCP implementation in `vultr/vultr-mcp`, supporting local STDIO and hosted Streamable HTTP. The official hosted service is documented at `https://vultrmcp.com/`; the server is read-only by default and can expose a very broad OpenAPI-derived tool surface when writes are explicitly enabled.

This connector evaluated that official MCP first, then selected the official Vultr REST API v2 (`https://api.vultr.com/v2`) for its curated operational surface. Direct REST is more appropriate here because it provides deterministic endpoint contracts, a small fixed allowlist, exact payload-bound approvals, write-specific no-retry behavior, and no automatic trust of a large evolving upstream tool catalog. No unofficial MCP server is used. Agent callers still interact exclusively through MCP tools and do not need to know the upstream transport.

Official sources researched for this connector:

- Official Vultr MCP server: https://github.com/vultr/vultr-mcp
- Official hosted MCP: https://vultrmcp.com/
- Vultr API documentation: https://docs.vultr.com/support/platform/api
- API rate limits: https://docs.vultr.com/support/platform/api/what-rate-limits-apply-to-the-vultr-api
- API access controls: https://docs.vultr.com/support/platform/users/how-can-i-manage-api-access-for-users
- Official Vultr Go SDK: https://github.com/vultr/govultr
- Vultr CLI snapshot reference: https://docs.vultr.com/reference/vultr-cli/snapshot

## Architecture

```text
MCP client / AI agent
        |
        v
Vultr connector (stdio MCP)
  - strict Zod schemas
  - fixed tool allowlist
  - risk/approval policy
  - response redaction
  - timeout / bounded read retries
        |
        v
Credential-isolated REST client
        |
        v
https://api.vultr.com/v2
```

Vultr-returned labels, hostnames, tags, firewall data, instance metadata, and other provider content are untrusted data. They never change connector policy, tool registration, credentials, or approval behavior.

## Authentication and least privilege

Set `VULTR_API_KEY` in the connector process. Requests authenticate using:

```text
Authorization: Bearer <VULTR_API_KEY>
```

The key is never accepted as an MCP tool argument and is never returned to the caller.

Vultr's current documentation states that account API keys are broad rather than product-scoped. Vultr also supports controlling API access per user and restricting allowed source IP/subnets. Use a dedicated least-privilege user/sub-account where appropriate, enable API access only where required, and restrict the key to trusted egress IP ranges. Connector-side tool restrictions are defense in depth and do not replace Vultr account permissions.

The connector intentionally omits API-key lifecycle, users, IAM, OAuth-client administration, billing mutations, and credential-returning operations. Vultr's official MCP implementation similarly excludes identity/credential-oriented categories by default because some upstream responses can contain sensitive material.

## Environment variables

Copy `.env.example` into your secret-management workflow. Do not commit populated credentials.

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `VULTR_API_KEY` | yes | - | Vultr API bearer credential |
| `VULTR_API_BASE_URL` | no | `https://api.vultr.com/v2` | Must remain the official Vultr API v2 origin |
| `VULTR_TIMEOUT_MS` | no | `15000` | Per-request timeout, 1000–120000 ms |
| `VULTR_MAX_RETRIES` | no | `2` | Additional retry count for safe reads, 0–5 |
| `VULTR_REQUIRE_WRITE_APPROVAL` | no | `true` | Require approval for ordinary WRITE tools |
| `VULTR_ENABLE_HIGH_RISK` | no | `false` | Process-side gate for HIGH_RISK operations |
| `VULTR_ENABLE_DESTRUCTIVE` | no | `false` | Process-side gate for DESTRUCTIVE operations |
| `VULTR_APPROVAL_SECRET` | for gated writes | - | HMAC secret kept outside model context |

The configured API URL is validated and pinned to `https://api.vultr.com/v2`, reducing SSRF and credential-forwarding risk.

## Installation and running

Requirements:

- Node.js 20 or later
- npm
- A Vultr API key with access to the intended account resources

```bash
npm install
npm run check
npm test
npm start
```

The connector exposes standard MCP over stdio. MCP clients that support launching local stdio servers can execute `node src/server.js` with credentials injected through the host's secure environment configuration.

Example shape:

```json
{
  "mcpServers": {
    "vultr-safe": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/vultr/src/server.js"],
      "env": {
        "VULTR_API_KEY": "provided-by-secret-store",
        "VULTR_ENABLE_HIGH_RISK": "false",
        "VULTR_ENABLE_DESTRUCTIVE": "false"
      }
    }
  }
}
```

Exact environment interpolation is MCP-host specific. Do not paste a live API key into a prompt or source-controlled configuration.

## Implemented capabilities

| MCP tool | REST operation | Risk | Approval |
|---|---|---|---|
| `vultr.instance.list` | `GET /instances` | READ | no |
| `vultr.instance.get` | `GET /instances/{id}` | READ | no |
| `vultr.region.list` | `GET /regions` | READ | no |
| `vultr.region.availability` | `GET /regions/{id}/availability` | READ | no |
| `vultr.plan.list` | `GET /plans` | READ | no |
| `vultr.os.list` | `GET /os` | READ | no |
| `vultr.ssh_key.list` | `GET /ssh-keys` | READ | no |
| `vultr.firewall_group.list` | `GET /firewalls` | READ | no |
| `vultr.firewall_rule.list` | `GET /firewalls/{id}/rules` | READ | no |
| `vultr.snapshot.list` | `GET /snapshots` | READ | no |
| `vultr.instance.tags.update` | `PATCH /instances/{id}` | WRITE | required by default |
| `vultr.instance.create` | `POST /instances` | HIGH_RISK | explicit + feature gate |
| `vultr.instance.reboot` | `POST /instances/reboot` with exactly one ID | HIGH_RISK | explicit + feature gate |
| `vultr.snapshot.create` | `POST /snapshots` | HIGH_RISK | explicit + feature gate |
| `vultr.instance.delete` | `DELETE /instances/{id}` | DESTRUCTIVE | explicit + disabled by default |
| `vultr.snapshot.delete` | `DELETE /snapshots/{id}` | DESTRUCTIVE | explicit + disabled by default |

There is no generic `execute_request`, arbitrary URL tool, arbitrary REST route, or dynamic upstream MCP passthrough.

## Real-world workflows

A safe capacity-planning flow can use:

```text
vultr.region.list
 -> vultr.region.availability
 -> vultr.plan.list
 -> vultr.os.list
 -> vultr.instance.list
```

An incident investigation can use:

```text
vultr.instance.get
 -> vultr.firewall_group.list
 -> vultr.firewall_rule.list
 -> human decision
 -> vultr.instance.reboot (explicit approval, if required)
```

A controlled backup/provision flow can inspect existing snapshots, receive approval, create a snapshot, then provision a new instance from an approved image/snapshot. See `examples/workflows.md` for concrete call shapes.

## Permission and human-approval model

READ tools may execute automatically.

WRITE tools require approval by default. Set `VULTR_REQUIRE_WRITE_APPROVAL=false` only if an equivalent trusted approval layer exists outside this connector.

HIGH_RISK tools are always approval-gated and are disabled unless `VULTR_ENABLE_HIGH_RISK=true` is configured outside MCP. Instance creation is HIGH_RISK because it provisions billable infrastructure. Reboot is HIGH_RISK because it changes runtime availability. Snapshot creation is HIGH_RISK because it creates persistent storage state and can affect operational/cost workflows.

DESTRUCTIVE tools are always approval-gated and additionally require `VULTR_ENABLE_DESTRUCTIVE=true`. Instance and snapshot deletion also require the caller to repeat the exact target ID as `confirmId`.

Approval is an HMAC-SHA256 digest over:

```text
<exact tool name>\n<canonical JSON payload excluding approvalToken>
```

The secret `VULTR_APPROVAL_SECRET` must remain in a trusted approval component or connector environment, never in model context. Any change to an instance ID, tags, plan, image, snapshot description, or confirmation field invalidates the token.

The intended control flow is:

```text
Read -> Recommend/Prepare -> Human reviews exact action -> Approval service signs exact payload -> Execute
```

## Input validation

Tool inputs are bounded and provider-specific:

- identifiers use conservative alphanumeric/underscore/hyphen formats;
- page sizes are capped at 100;
- cursors and text values have length limits;
- tags and SSH-key arrays are bounded;
- compute creation requires exactly one of `osId` or `snapshotId`;
- destructive calls require exact ID confirmation;
- no tool accepts credentials, arbitrary HTTP methods, raw URLs, or arbitrary provider request bodies.

The instance-create tool deliberately omits `user_data`, passwords, arbitrary cloud-init, and other secret-prone free-form provisioning inputs. Those should be delivered through a separately reviewed secret/configuration pipeline when required.

## Reliability and rate limiting

Vultr's official documentation, updated April 15, 2026, states that clients exceeding 30 requests per second may receive HTTP `429 Too Many Requests` and recommends reducing calls and using delayed/exponential retries.

This connector:

- applies an AbortController-backed timeout to every provider request;
- accepts MCP cancellation signals when available and propagates them into HTTP cancellation;
- retries only safe `GET`/`HEAD` calls;
- retries only transient network failures plus HTTP `429`, `502`, `503`, and `504`;
- uses bounded exponential backoff;
- honors a bounded `Retry-After` value when supplied;
- never blindly retries create, update, reboot, snapshot, or delete operations;
- preserves Vultr rate-limit headers in the output envelope when available;
- exposes bounded provider pagination rather than draining collections automatically.

Authentication, authorization, validation, and ordinary client errors are not treated as transient failures.

## Error handling

Provider HTTP failures become bounded `VultrApiError` values carrying HTTP status, optional provider code, and retry timing where available. Timeout and network failures are surfaced distinctly enough for an orchestrator to decide whether a later read retry is appropriate.

The connector recursively redacts credential-shaped provider fields such as passwords, tokens, API keys, user data, S3 credentials, and console/VNC URL fields before returning responses. Public SSH-key material is not treated as a secret, but deployments should still limit metadata exposure to principals that need it.

## Security considerations

- Vultr API credentials remain inside the connector transport layer.
- API origin is fixed to the official HTTPS host.
- No arbitrary HTTP or dynamic upstream MCP tool is exposed.
- Provider content is explicitly marked untrusted and cannot change system behavior.
- Credential-like response fields are redacted.
- API/user/IAM/OAuth/key-management operations are omitted.
- Sensitive instance user-data retrieval is not exposed.
- HIGH_RISK and DESTRUCTIVE execution is disabled by default.
- Write approvals are bound to exact payloads.
- Mutations are single-attempt to avoid duplicate side effects after ambiguous failures.
- Use Vultr's source-IP restrictions for API access as an additional network-level control.

The official Vultr MCP server remains a good option for direct clients that want its broad generated surface. This connector does not automatically proxy it because newly added upstream capabilities should not silently expand an agent's authority.

## Testing

Normal unit tests use mocked HTTP and require no live Vultr credential:

```bash
npm run check
npm test
```

Coverage includes:

- required authentication configuration;
- official API-host enforcement;
- retry/timeout configuration bounds;
- tool/policy registration parity;
- read execution without approval;
- exact-payload approval binding;
- default denial of HIGH_RISK and DESTRUCTIVE actions;
- provider credential isolation in transport headers;
- bounded throttling retry for reads;
- authentication failure no-retry behavior;
- mutation no-retry behavior;
- unsafe-path denial;
- recursive sensitive-field redaction.

No live provisioning or destructive integration test is part of the normal suite.

## Limitations

- This connector implements 16 focused capabilities rather than the full Vultr API or official MCP surface.
- It does not create, rotate, list, or delete API keys.
- It does not mutate users, IAM, OAuth clients, billing, account permissions, DNS, firewall rules, load balancers, Kubernetes, databases, object storage, or network security policy.
- It does not expose instance passwords, console URLs, VNC URLs, or user-data content.
- It does not implement browser OAuth/OIDC for the official hosted Vultr MCP server; OAuth-capable clients can connect to that official service directly.
- Provider plans, regional inventory, quotas, API access controls, and account permissions remain authoritative for all calls.
- Snapshot creation is asynchronous on the provider side; callers should inspect `vultr.snapshot.list` rather than assuming immediate completion.
