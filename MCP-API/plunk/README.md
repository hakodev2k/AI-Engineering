# Plunk MCP/API Connector

Reusable, safety-gated MCP server for Plunk email operations. Node.js 20+.

## Upstream strategy

Plunk publishes the official `@plunk/mcp` local stdio server. Current official documentation describes 23 tools across contacts, templates, campaigns, segments, domains, verification, event tracking and sending, with structural read-only mode. This connector uses the official documented REST API directly for its stable external contract because that permits a narrower allowlist, connector-owned approval policy, deterministic schemas and explicit retry behavior. It does not install or trust a third-party MCP implementation. The official MCP remains the preferred direct option when its full tool set is desired.

Official sources researched 2026-09-22:
- https://docs.useplunk.com/guides/mcp-server
- https://www.useplunk.com/features/mcp
- https://docs.useplunk.com/api-reference/overview
- https://docs.useplunk.com/guides/api-keys
- https://docs.useplunk.com/api-reference/public-api/sendEmail

API base URL: `https://next-api.useplunk.com`. API authentication is `Authorization: Bearer ...`. Plunk documents `sk_*` secret keys for server-side endpoints; the public `pk_*` key is intentionally restricted to event tracking. This connector requires an `sk_*` key and keeps it inside the client layer.

## Capabilities

15 tools are implemented: `plunk.contact.list`, `plunk.contact.get`, `plunk.contact.create`, `plunk.contact.update`, `plunk.email.verify`, `plunk.email.send`, `plunk.template.list`, `plunk.campaign.list`, `plunk.campaign.get`, `plunk.campaign.stats`, `plunk.segment.list`, `plunk.activity.list`, `plunk.analytics.timeseries`, `plunk.campaign.test`, and `plunk.campaign.send`.

The connector intentionally omits deletion, billing, key rotation, project administration, permission changes, workflow mutation, and arbitrary HTTP passthrough. Account-level actions remain outside the agent surface.

## Architecture and security

`server.js` registers only the allowlisted MCP tools. `tools.js` owns strict Zod schemas and risk labels. `policy.js` gates mutations. `client.js` is the only component that receives the secret key and communicates with the configured Plunk origin. Provider content is returned with `trust: untrusted_provider_data`; callers must never interpret retrieved email/template/contact content as system instructions.

`PLUNK_READ_ONLY=true` is the default and blocks every mutation. Setting it false is insufficient by itself: normal writes also require `PLUNK_ALLOW_WRITES=true`. External email/campaign sends additionally require `PLUNK_ALLOW_SENDS=true` and the tool input must contain literal `approved:true`, representing approval supplied by the surrounding human-approval layer. Destructive operations are not registered.

For self-hosting, `PLUNK_API_URL` may point to another HTTPS origin. Plain HTTP is rejected except localhost/127.0.0.1, reducing SSRF/configuration mistakes. The client refuses cross-origin request paths. Never expose the MCP process to untrusted local users because its environment contains a project secret key.

## Reliability and limits

Plunk documents cursor pagination for most list APIs (`limit` max 100) and a project API limit of 1000 requests/minute; email sending is separately throttled for deliverability. The connector bounds timeouts and retries. Only GET reads retry on HTTP 429/5xx, with bounded exponential backoff and `Retry-After` support. Writes and sends are never blindly retried, preventing duplicate side effects. Authentication, authorization and validation failures are not retried.

Transactional sends support inline subject/body or a template. Plunk documents up to 10 attachments and 10 MB attachment total / 40 MB message total, but this connector deliberately does not expose attachments in v1 to keep the tool surface small and avoid large model-originated payloads.

## Install and run

```bash
npm install
cp .env.example .env
# provide PLUNK_API_KEY securely; do not commit .env
npm start
```

Configure an MCP client to launch `node /absolute/path/MCP-API/plunk/src/server.js` with the required environment variables. This is standard stdio MCP and can be used by MCP clients that support launching local stdio servers. Compatibility depends on the client's MCP support; no vendor-specific integration is required.

Environment variables:
- `PLUNK_API_KEY` required, secret `sk_*` key.
- `PLUNK_API_URL` optional, defaults to Plunk Cloud.
- `PLUNK_READ_ONLY` defaults true.
- `PLUNK_ALLOW_WRITES` defaults false.
- `PLUNK_ALLOW_SENDS` defaults false.
- `PLUNK_TIMEOUT_MS` defaults 15000, clamped 1–60 seconds.
- `PLUNK_MAX_RETRIES` defaults 2, clamped 0–4.

Use a dedicated Plunk project/key for agent traffic where practical. Never place the key in prompts, tool arguments, logs, examples, or source control.

## Permission model

READ tools may execute automatically. WRITE tools require read-only mode disabled plus the write gate. HIGH_RISK tools (`email.send`, `campaign.test`, `campaign.send`) additionally require the send gate and explicit approval. DESTRUCTIVE tools are absent/disabled. This connector cannot silently escalate these environment-level permissions.

## Errors

Provider HTTP failures are mapped to `PlunkError` with status/code and optional `Retry-After`. Timeout is reported as code `timeout`. MCP handlers return structured failures without leaking credentials. A 401 generally requires key correction/rotation by a human; 403 indicates authorization/project state; 422 is input/provider validation; 429 is throttling.

## Testing

```bash
npm test
```

Tests use fakes and require no live credentials. They cover secret-key configuration, HTTPS enforcement, permission denial, explicit send approval, tool registration, input validation, bearer authentication, pagination request behavior, bounded rate-limit retry and the no-retry rule for writes.

## Limitations

This connector is intentionally narrower than Plunk's official MCP server. It does not proxy all 23 official MCP tools, expose arbitrary API endpoints, upload files, mutate templates/segments/workflows, delete resources, rotate keys, or perform billing/project administration. Domain listing is not exposed because the documented REST route requires a project ID while API keys derive project context; the official MCP is preferable for that capability. Event tracking is omitted from this server-side connector to avoid ambiguity between Plunk's public-key and secret-key event flows. See `examples/workflows.md` for safe usage patterns.
