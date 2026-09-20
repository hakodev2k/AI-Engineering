# Elastic Cloud MCP/API Connector

Reusable MCP server for Elastic Cloud control-plane workflows. It exposes scoped, action-oriented MCP tools backed by Elastic's official Cloud REST API and keeps the Elastic API key inside the connector process.

## Transport strategy

Upstream transport is the official Elastic Cloud REST API (`https://api.elastic-cloud.com`). This connector does not proxy arbitrary URLs or expose a generic request tool. The downstream MCP transport is stdio using the official Model Context Protocol TypeScript SDK.

Official references:

- Elastic Cloud API hub: https://www.elastic.co/docs/api/doc/cloud/
- Elastic Cloud API authentication and generated endpoint reference are available from that API hub.
- Elastic Cloud API base: `https://api.elastic-cloud.com`

The implementation intentionally uses REST for the cloud control plane. MCP callers receive a stable provider-scoped contract independent of Elastic endpoint details.

## Capabilities

Implemented tools:

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `elastic-cloud.deployment.list` | List deployments | READ | No |
| `elastic-cloud.deployment.get` | Get deployment | READ | No |
| `elastic-cloud.deployment.resource.list` | List resources in deployment | READ | No |
| `elastic-cloud.deployment.resource.get` | Get a resource | READ | No |
| `elastic-cloud.deployment.activity.list` | Inspect deployment Elasticsearch resource/activity state | READ | No |
| `elastic-cloud.region.list` | List infrastructure regions | READ | No |
| `elastic-cloud.stack_version.list` | List stack versions | READ | No |
| `elastic-cloud.traffic_filter.list` | List traffic-filter rulesets | READ | No |
| `elastic-cloud.traffic_filter.get` | Get traffic-filter ruleset | READ | No |
| `elastic-cloud.deployment.create` | Create deployment | WRITE | Required |
| `elastic-cloud.deployment.update` | Update deployment topology/configuration | HIGH_RISK | Explicit |
| `elastic-cloud.deployment.shutdown` | Shut down deployment | HIGH_RISK | Explicit |
| `elastic-cloud.deployment.delete` | Delete deployment | DESTRUCTIVE | Disabled by default |

The connector does not claim coverage of every Elastic Cloud endpoint.

## Architecture

`src/server.ts` contains the MCP server, strict input schemas, permission gates, credential-isolated HTTP client, provider error mapping, timeouts, bounded retry handling, and untrusted-output wrapping. `manifest.yaml` is the machine-readable capability/risk summary. `tests/server.test.ts` exercises authentication isolation, validation, provider errors, rate limiting, retry policy, and server construction. `examples/workflows.md` demonstrates agent workflows.

## Authentication

Create an Elastic Cloud API key with only the privileges required for the tools you intend to expose, then set:

```bash
export ELASTIC_CLOUD_API_KEY='...'
```

The connector sends it as `Authorization: ApiKey <key>`. The key is read only by the connector process and is never returned in MCP output. Do not place credentials in prompts or MCP arguments.

For self-managed or alternate supported Cloud API endpoints, `ELASTIC_CLOUD_API_BASE` is configurable, but it must be HTTPS. Requests are restricted to the configured origin and all tool paths are connector-owned relative paths, reducing SSRF and credential-exfiltration risk.

## Environment variables

Copy `.env.example` into your secret-management workflow. `ELASTIC_CLOUD_API_KEY` is required. `ELASTIC_CLOUD_API_BASE` defaults to the managed Elastic Cloud API. `ELASTIC_CLOUD_TIMEOUT_MS` defaults to 15000. Approval variables default to false.

## Install and run

Requires Node.js 20+ (Node.js 22+ recommended).

```bash
npm install
npm run build
ELASTIC_CLOUD_API_KEY='...' npm start
```

Any MCP client that can launch a stdio MCP server can invoke this package. Configure the command to run `node <connector>/dist/src/server.js` with credentials supplied through the client's secure environment configuration.

## Permission and approval model

READ tools can execute automatically. WRITE creation is blocked unless `ELASTIC_CLOUD_APPROVE_WRITES=true`. Topology changes and shutdown are HIGH_RISK and require `ELASTIC_CLOUD_APPROVE_HIGH_RISK=true`. Permanent deletion is DESTRUCTIVE and disabled unless `ELASTIC_CLOUD_ALLOW_DESTRUCTIVE=true` is deliberately set. These flags are process-side gates: retrieved provider content cannot change them.

Use approval variables for a narrowly scoped human-approved execution, not as permanently enabled global settings. Provider API authorization remains an independent second boundary.

## Validation and security

Identifiers have bounded length and conservative character sets. Provider and region values are enumerated or validated. Pagination is bounded. Arbitrary API paths, arbitrary HTTP methods, and arbitrary URLs are not exposed. The base URL must use HTTPS and cross-origin requests are rejected.

Elastic responses are wrapped with `untrusted: true`; callers must treat deployment names, metadata, configuration text, and other provider content as data rather than instructions. Credentials are never included in output. Logs should not print environment variables or request authorization headers.

## Reliability and rate limiting

Each request has an AbortController timeout. Safe GET/HEAD requests retry at most twice after the initial attempt for HTTP 429 and transient 5xx responses, honoring `Retry-After` when present and otherwise using exponential backoff. Mutating requests are not blindly retried because repeating create/update/shutdown/delete can cause unintended state changes. Authentication, authorization, validation, and other 4xx failures are not retried.

Provider failures are mapped to `ElasticCloudError`, retaining status, `Retry-After`, and request ID when supplied. Pagination parameters are bounded to avoid accidental high-volume enumeration.

Elastic Cloud quotas and endpoint behavior can vary by service and account. The connector therefore treats 429 plus `Retry-After` as authoritative rather than hard-coding a universal request quota.

## Testing

Normal tests use mocked fetch implementations and require no live Elastic credentials:

```bash
npm test
```

Coverage includes credential injection, absolute/cross-origin path rejection, provider-error mapping, bounded 429 retry, no blind retry for writes, and MCP server construction. Live integration testing should be performed only in a non-production Elastic Cloud organization with a least-privilege API key.

## Usage examples

See `examples/workflows.md`. A common safe sequence is: list deployments → inspect deployment → inspect resources → inspect region/version/traffic-filter metadata → recommend a change → obtain human approval → execute a gated write.

## Limitations

This connector targets Elastic Cloud control-plane operations, not Elasticsearch document search, Kibana saved-object APIs, or arbitrary cluster requests. It does not expose generic REST passthrough. Request bodies for create/update remain typed as non-empty JSON objects because Elastic deployment topology schemas are large and versioned; Elastic's API validates their detailed shape. The connector's approval boundary still applies before those requests leave the process.

API keys inherit the privileges granted by Elastic Cloud. Least privilege must be configured at the provider. If an Elastic API revision changes a control-plane route or request schema, update and retest this connector against the current official API reference before production use.
