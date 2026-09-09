# ngrok MCP/API Connector

Reusable MCP server for safe, agent-friendly management of selected ngrok resources.

## Provider and purpose

This connector exposes a scoped set of ngrok account operations as stable MCP tools for endpoint discovery/management and reserved-domain management. It is intended for reusable AI-agent workflows without exposing arbitrary HTTP access or raw credentials to the model.

## Upstream transport

The connector uses the official ngrok REST API at `https://api.ngrok.com` with API version header `ngrok-version: 2`.

Research performed against official ngrok documentation on 2026-09-09 established that:

- ngrok provides an official REST API for account resources, including endpoints and reserved domains.
- Official API client libraries exist for Go, .NET, Ruby, Python, Java, and Scala, plus an official Terraform provider.
- The documented API uses bearer API keys.
- List endpoints use `limit` and `before_id`, with a maximum limit of 100, and may expose `next_page_uri`.
- The account API rate limit is 120 requests per rolling 60-second window; exceeding it returns HTTP 429 / `ERR_NGROK_226`.
- Cloud endpoints can be created, updated, and deleted through the REST API.
- Reserved domains can be created, read, updated, listed, and deleted through the REST API.
- No official ngrok MCP server was identified in the official ngrok MCP/API documentation researched for this connector. ngrok documents secure connectivity to MCP servers, but that is a networking use case rather than an ngrok account-management MCP server. Therefore this connector uses the official REST API and exposes its own MCP interface.

Official sources:

- https://ngrok.com/docs/api
- https://ngrok.com/docs/api-reference/endpoints/create
- https://ngrok.com/docs/api-reference/endpoints/update
- https://ngrok.com/docs/api-reference/endpoints/delete
- https://ngrok.com/docs/api-reference/reserveddomains/get
- https://ngrok.com/docs/api-reference/reserveddomains/update
- https://ngrok.com/docs/api-reference/reserveddomains/delete
- https://ngrok.com/docs/api/api-filtering
- https://ngrok.com/docs/agent-sdks

## Architecture

```text
MCP client
   |
   v
src/index.ts          MCP tool registration + validation
   |
   v
src/policy.ts         READ/WRITE/DESTRUCTIVE approval enforcement
   |
   v
src/client.ts         bounded retries, timeout, error mapping, rate-limit handling
   |
   v
src/config.ts         credential/config isolation and API-origin validation
   |
   v
https://api.ngrok.com
```

Provider responses are wrapped with `untrusted_data: true`. Retrieved provider content must be treated as data, never as instructions that can modify permissions or system behavior.

## Authentication

Create an ngrok API key in the ngrok dashboard and provide it only to the connector process:

```bash
export NGROK_API_KEY='...'
```

The connector sends it as:

```text
Authorization: Bearer <NGROK_API_KEY>
ngrok-version: 2
```

The key is never accepted as a tool argument and is never included in MCP output.

Use the least-privileged account/service-user arrangement available for the deployment. Do not place keys in prompts, source control, examples, or client-visible configuration.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `NGROK_API_KEY` | yes | - | Official ngrok API bearer key |
| `NGROK_API_BASE` | no | `https://api.ngrok.com` | API base; implementation intentionally rejects other origins |
| `NGROK_API_VERSION` | no | `2` | ngrok API version header |
| `NGROK_REQUEST_TIMEOUT_MS` | no | `15000` | Per-request timeout, 1-120 seconds |
| `NGROK_REQUIRE_WRITE_APPROVAL` | no | `true` | Require `approved=true` for WRITE tools |
| `NGROK_DESTRUCTIVE_ENABLED` | no | `false` | Operator opt-in for destructive tools |

See `.env.example`.

## Installation

Requires Node.js 20+ (Node.js 22 recommended).

```bash
npm install
npm run build
npm test
```

Run the MCP server over stdio:

```bash
npm start
```

Any MCP client capable of launching a stdio MCP server can use the built entry point. Client-specific configuration varies by product and is intentionally not hard-coded here.

## Implemented tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `ngrok.endpoint.list` | REST | READ | no |
| `ngrok.endpoint.get` | REST | READ | no |
| `ngrok.endpoint.create` | REST | WRITE | configurable, default required |
| `ngrok.endpoint.update` | REST | WRITE | configurable, default required |
| `ngrok.endpoint.delete` | REST | DESTRUCTIVE | explicit + operator enablement |
| `ngrok.reserved_domain.list` | REST | READ | no |
| `ngrok.reserved_domain.get` | REST | READ | no |
| `ngrok.reserved_domain.create` | REST | WRITE | configurable, default required |
| `ngrok.reserved_domain.update` | REST | WRITE | configurable, default required |
| `ngrok.reserved_domain.delete` | REST | DESTRUCTIVE | explicit + operator enablement |

### Endpoint tools

`ngrok.endpoint.list` supports `limit`, `before_id`, and ngrok CEL `filter` parameters. `ngrok.endpoint.create` intentionally accepts only `type: "cloud"`, matching the documented create capability. Endpoint mutation validates URLs and bounds metadata/traffic-policy input sizes.

### Reserved-domain tools

Domain creation validates a hostname/wildcard-hostname shape before contacting ngrok. The connector implements only common domain fields (`domain`, `description`, `metadata`) instead of exposing unrestricted provider payloads. Advanced certificate-management and resolver configuration remain unsupported by this connector version.

## Permission and approval model

`READ` operations execute automatically.

`WRITE` operations require `approved=true` by default. Operators may disable this requirement with `NGROK_REQUIRE_WRITE_APPROVAL=false`, though requiring approval is the recommended setting.

`DESTRUCTIVE` operations use two independent gates:

1. the operator must set `NGROK_DESTRUCTIVE_ENABLED=true`; and
2. the individual tool call must contain `approved=true`.

A tool caller cannot silently enable destructive mode because this setting is process configuration, not an MCP argument.

## Reliability and rate limiting

The client uses an `AbortController` timeout for every request. GET requests have at most three attempts and use bounded exponential backoff for transient network failures, HTTP 5xx responses, and HTTP 429. A provider `Retry-After` value is preserved and honored with a safety cap.

Mutating requests are not automatically retried. This avoids accidental duplicate resource creation or repeated destructive actions.

Authentication, authorization, and validation failures are not retried.

ngrok documents an account REST API limit of 120 requests per rolling 60-second window. Tools use native pagination instead of recursively draining pages, so callers control request volume.

## Errors

Provider failures are converted to MCP tool errors. The connector surfaces the provider message where available but never returns credentials. Common cases include:

- missing/invalid API key;
- insufficient account permissions;
- invalid endpoint/domain input;
- HTTP 429 throttling;
- provider HTTP 5xx errors;
- network failures;
- request timeouts.

## Security considerations

- Credentials remain inside `src/config.ts` / `src/client.ts`; they are never tool inputs.
- The API base is pinned to the official HTTPS `api.ngrok.com` origin to prevent SSRF through configuration or tool arguments.
- No generic `request(url, body)` MCP tool exists.
- Resource IDs are encoded before insertion into API paths.
- Tool inputs are validated with strict, bounded Zod schemas.
- Provider content is marked as untrusted data.
- Writes and destructive actions are separated from reads and governed by explicit policy.
- Destructive operations are disabled by default.
- Automatic retries are limited to idempotent reads.
- The connector does not allow retrieved content to alter tool registration, credentials, approval configuration, or API origins.
- Logs should remain metadata-only; do not add request-header logging without secret redaction.

## Real-world workflows

Typical safe workflows include:

1. list endpoints -> inspect one endpoint -> propose a configuration change -> obtain approval -> update the endpoint;
2. list reserved domains -> inspect DNS/certificate metadata -> reserve a new domain with approval;
3. inspect a cloud endpoint -> prepare a revised Traffic Policy -> apply only after human approval;
4. inspect resources before cleanup -> require explicit approval and destructive-mode enablement before deletion.

See `examples/workflows.md` for request/response examples.

## Testing

Normal tests require no live ngrok credentials.

```bash
npm test
```

The suite covers:

- missing authentication configuration;
- rejection of non-official API origins;
- READ/WRITE/DESTRUCTIVE policy behavior;
- approval denial;
- authorization/version headers;
- successful read parsing;
- bounded rate-limit retry;
- no automatic retry for writes;
- no retry for authentication failure.

Live integration tests are intentionally excluded so CI does not require secrets or mutate real ngrok resources.

## Limitations

This is deliberately not a complete wrapper for the ngrok API. It does not currently expose API-key management, credentials/authtokens, certificate deletion, tunnel-session restart/update commands, IP-policy mutation, billing, or unrestricted Traffic Policy administration beyond the policy string attached to a cloud endpoint. Those surfaces either broaden credential/security impact or are less central to the target agent workflows.

Agent-created ephemeral endpoints are discoverable through the endpoint API where ngrok returns them, but endpoint create/update/delete tools are intended for the documented cloud-endpoint lifecycle. Creating local agent tunnels is also not implemented; ngrok's Agent API/SDK is a separate transport with different lifecycle and authentication concerns.
