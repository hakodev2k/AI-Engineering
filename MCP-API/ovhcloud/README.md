# OVHcloud MCP/API Connector

Reusable MCP server exposing a deliberately scoped subset of OVHcloud account, Public Cloud, VPS, and domain operations through the official OVHcloud REST API.

## Transport strategy

No official OVHcloud-operated MCP server was identified in the official materials reviewed for this implementation. The connector therefore uses OVHcloud's official REST API and exposes stable provider-scoped MCP tools over stdio.

Official sources researched:

- OVHcloud API console and reference: https://api.ovh.com/console/
- OVHcloud API authentication: https://help.ovhcloud.com/csm/en-api-getting-started-ovhcloud-api?id=kb_article_view&sysparm_article=KB0042789
- API credential request flow: https://api.ovh.com/createToken/
- OVHcloud API endpoints: https://github.com/ovh/node-ovh
- Public Cloud API reference: https://api.ovh.com/console/#/cloud/project
- VPS API reference: https://api.ovh.com/console/#/vps
- Domain API reference: https://api.ovh.com/console/#/domain

The selected capabilities are backed by documented OVHcloud API operations. No unofficial MCP server is a runtime dependency.

## Architecture

```text
MCP client / agent
  -> OVHcloud connector over stdio
  -> strict Zod validation
  -> risk + approval policy
  -> credential-isolated signed REST client
  -> official OVHcloud API
```

Provider responses are wrapped with `untrustedProviderContent: true`. Account names, instance metadata, VPS data, and domain information must be treated as data rather than instructions.

## Authentication

OVHcloud's API authentication model uses three credentials:

- Application Key
- Application Secret
- Consumer Key

For authenticated calls the connector sends `X-Ovh-Application`, `X-Ovh-Consumer`, `X-Ovh-Timestamp`, and `X-Ovh-Signature`. The signature follows OVHcloud's documented SHA-1 request-signing scheme. Server time is synchronized through `/auth/time` before signed requests.

Credentials are read only from the connector environment. They are never accepted as MCP tool parameters and never returned in MCP outputs.

When creating the Consumer Key, request only API rules needed for the capabilities you intend to enable. Read-only deployments should grant only the required GET routes. Reboot tools require the corresponding POST routes and should be omitted from the Consumer Key when not needed.

## Environment variables

```text
OVH_ENDPOINT=https://eu.api.ovh.com/1.0
OVH_APPLICATION_KEY=
OVH_APPLICATION_SECRET=
OVH_CONSUMER_KEY=
OVH_TIMEOUT_MS=15000
OVH_MAX_RETRIES=2
OVH_REQUIRE_WRITE_APPROVAL=true
OVH_ENABLE_HIGH_RISK=false
OVH_APPROVAL_SECRET=
```

Supported official endpoint hosts in this connector are:

- `eu.api.ovh.com`
- `ca.api.ovh.com`
- `api.us.ovhcloud.com`

The endpoint must use HTTPS. Arbitrary upstream hosts are rejected to reduce SSRF and credential-forwarding risk.

## Runtime and installation

Requires Node.js 20 or later.

```bash
npm install
npm run build
npm test
npm start
```

The server exposes MCP over stdio and can be launched by MCP clients that support local stdio servers.

## Implemented tools

| Tool | Upstream API | Risk | Approval |
|---|---|---|---|
| `ovhcloud.account.get` | `GET /me` | READ | No |
| `ovhcloud.cloud.project.list` | `GET /cloud/project` | READ | No |
| `ovhcloud.cloud.project.get` | `GET /cloud/project/{serviceName}` | READ | No |
| `ovhcloud.cloud.instance.list` | `GET /cloud/project/{serviceName}/instance` | READ | No |
| `ovhcloud.cloud.instance.get` | `GET /cloud/project/{serviceName}/instance/{instanceId}` | READ | No |
| `ovhcloud.cloud.instance.reboot` | `POST /cloud/project/{serviceName}/instance/{instanceId}/reboot` | HIGH_RISK | Yes + feature gate |
| `ovhcloud.vps.list` | `GET /vps` | READ | No |
| `ovhcloud.vps.get` | `GET /vps/{serviceName}` | READ | No |
| `ovhcloud.vps.reboot` | `POST /vps/{serviceName}/reboot` | HIGH_RISK | Yes + feature gate |
| `ovhcloud.domain.list` | `GET /domain` | READ | No |
| `ovhcloud.domain.get` | `GET /domain/{serviceName}` | READ | No |

The connector intentionally excludes arbitrary API execution, billing changes, IAM/contact changes, service termination, instance deletion, VPS deletion, domain transfer/mutation, credential creation, and other destructive administration.

## Permission and approval model

READ tools may execute automatically.

Reboots are classified HIGH_RISK because they can interrupt production workloads. They are disabled by default and require both:

1. `OVH_ENABLE_HIGH_RISK=true` set by the operator outside model context.
2. A payload-bound `approvalId` generated from `OVH_APPROVAL_SECRET`.

Approval is HMAC-SHA256 over:

```text
<tool-name>\n<canonical-json-payload-without-approvalId>
```

Changing the service, project, instance, or any other approved argument invalidates the approval. The approval secret must remain outside the LLM and should be held by a trusted UI/service that issues approvals only after explicit human confirmation.

No DESTRUCTIVE tools are exposed.

## Reliability

Every provider request has a bounded timeout. Safe GET requests may retry transient network failures and HTTP `429`, `502`, `503`, or `504` responses up to `OVH_MAX_RETRIES`, with bounded exponential backoff. `Retry-After` is honored when the provider supplies it.

Mutating operations are single-attempt and are never blindly retried. Authentication, authorization, validation, and ordinary 4xx failures require caller/operator action rather than automatic replay.

OVHcloud does not publish one universal rate limit for every API family/account. The connector therefore treats provider throttling responses and `Retry-After` as authoritative rather than inventing a fixed quota.

## Validation and security

- Tool names are provider-scoped and fixed.
- No arbitrary HTTP request or URL tool exists.
- Provider paths are hard-coded by handler.
- Service names and instance identifiers are character- and length-bounded.
- Credentials remain inside the transport layer.
- Official API hosts are allowlisted and HTTPS-only.
- High-risk operations require an operator feature gate plus exact-action human approval.
- Writes are never automatically retried.
- Provider content is labeled untrusted and cannot alter policy or permissions.
- The connector never creates or expands its own OVHcloud credentials or API access rules.

## Error handling

Provider failures are mapped to `OvhError` values carrying HTTP status and optional retry timing. Response bodies are bounded before surfacing them. Authentication and permission errors are not retried. Request cancellation/timeout becomes an explicit connector error.

The API signing material is not included in returned errors or MCP tool output.

## Testing

Normal tests require no live OVHcloud credentials.

```bash
npm test
```

Tests cover:

- official-host validation
- authentication/signature header placement
- HIGH_RISK classification
- default denial of reboot actions
- payload-bound approval acceptance and invalidation
- non-retry of mutating requests

## Example workflows

See `examples/workflows.md` for Public Cloud inventory, controlled instance reboot, VPS diagnostics/reboot, and domain inventory examples including risk and approval expectations.

## Limitations

- Interactive credential creation is not implemented; Application Key, Application Secret, and Consumer Key must be provisioned outside the connector.
- The package intentionally covers only 11 high-value operations rather than the full OVHcloud API catalog.
- Public Cloud instance lifecycle operations other than reboot are omitted.
- VPS lifecycle operations other than reboot are omitted.
- Domain mutation, DNS record mutation, service termination, billing, IAM/contact administration, dedicated servers, Kubernetes, Object Storage, and database services are outside this connector's current surface.
- Exact access remains constrained by the API rules attached to the Consumer Key and by the OVHcloud account's provider-side permissions.
