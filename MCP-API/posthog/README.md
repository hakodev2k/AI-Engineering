# PostHog MCP/API Connector

Reusable MCP stdio connector for PostHog product analytics and feature-flag workflows.

## Transport strategy
PostHog operates an official hosted MCP endpoint at `https://mcp.posthog.com/mcp` and documents stable MCP tool names. It supports analytics, feature flags, dashboards, error tracking, SQL, and many other products. This connector deliberately uses PostHog's official private REST API for its narrow tool set because fixed project scoping, strict local schemas, payload-bound approvals, bounded retry behavior, and destructive-action gating are easier to audit at the connector boundary. No unofficial upstream server is used.

Official sources researched on 2026-08-28:
- https://posthog.com/docs/model-context-protocol
- https://posthog.com/docs/model-context-protocol/tools
- https://posthog.com/docs/api
- PostHog OpenAPI/Swagger schema (`/api/schema/`)

## Authentication
Private PostHog endpoints require authentication. PostHog documents Personal API keys for scripts/automations tied to an account, project secret API keys (beta) for certain server-to-server use cases, and OAuth for installable integrations. This connector uses a Personal API key and sends it only from the credential layer as `Authorization: Bearer ...`.

Environment:
- `POSTHOG_BASE_URL`: private API origin, default `https://us.posthog.com`; EU uses `https://eu.posthog.com`; self-hosted deployments use their HTTPS origin.
- `POSTHOG_PERSONAL_API_KEY`: required; never passed as a tool argument.
- `POSTHOG_PROJECT_ID`: required numeric project ID; fixes all tools to one project.
- `POSTHOG_TIMEOUT_MS`: default 10000.
- `POSTHOG_MAX_RETRIES`: default 3, maximum 5.
- `POSTHOG_APPROVAL_SECRET`: required for write/high-risk/destructive execution.
- `POSTHOG_ENABLE_DESTRUCTIVE`: false by default.

Use a Personal API key preset/scopes limited to the resources needed by this connector. Do not grant organization administration, billing, member-management, or API-key-management privileges when not required.

## Tools
- `posthog.project.get` — READ
- `posthog.dashboard.list` / `posthog.dashboard.get` — READ
- `posthog.insight.list` / `posthog.insight.get` — READ
- `posthog.feature_flag.list` / `posthog.feature_flag.get` — READ
- `posthog.feature_flag.create` — WRITE, approval required
- `posthog.feature_flag.update` — HIGH_RISK, approval required
- `posthog.feature_flag.delete` — DESTRUCTIVE, disabled by default + approval
- `posthog.person.list` / `posthog.person.get` — READ

The connector intentionally does not expose arbitrary PostHog API calls, user/member administration, API-key management, billing mutations, raw SQL/HogQL, external messages, or generic delete tools.

## Approval model
Non-read calls require a 64-character hex HMAC-SHA256 over:
`<tool-name>\n<canonical JSON payload without approval_token>` using `POSTHOG_APPROVAL_SECRET`. The approval is tied to the exact action. Destructive tools additionally require the out-of-band feature flag `POSTHOG_ENABLE_DESTRUCTIVE=true`.

## Rate limits and reliability
PostHog's current API docs specify, among other limits: analytics endpoints 240/minute and 1200/hour; query endpoint 2400/hour; feature-flag local evaluation 600/minute; most other private CRUD endpoints 480/minute and 4800/hour. Limits apply at team scope. The connector bounds pagination to 100 items per call, handles timeouts, maps provider errors, honors integer `Retry-After`, retries only safe reads on 429/502/503/504, and never blindly retries writes or deletes.

PostHog pagination commonly returns `next`, `previous`, and `results`; callers should use bounded list tools rather than attempting large exports. Large/regular analytics exports should use PostHog's batch-export mechanisms instead of repeatedly calling these tools.

## Security
- Credentials stay inside the connector and are never returned.
- Base URL must be a credential-free HTTPS origin, reducing SSRF risk.
- All tools are fixed to configured `POSTHOG_PROJECT_ID`.
- Third-party content is returned as `untrusted_provider_data` and must not be treated as instructions.
- Feature-flag writes require human approval; deletion is disabled by default.
- Tool schemas cap page sizes, strings, tags, and mutable fields.
- Retrieved PostHog content cannot alter permissions or enable destructive mode.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run check
npm test
npm start
```
The server uses standard MCP stdio transport and can be configured in MCP clients that support stdio tool servers.

## Tests
Unit tests require no live credentials and cover tool registration, approval binding, destructive denial, bearer authentication, 401 handling, 429 retry behavior, and no blind write retry.

## Limitations
- This package does not proxy the full official PostHog MCP catalog; it intentionally exposes a smaller audited surface.
- It does not evaluate feature flags for end users; use PostHog's `/flags` public endpoint or official SDKs for runtime evaluation.
- It does not run arbitrary HogQL/SQL.
- API fields and feature availability can vary by PostHog version, plan, and self-hosted release.
