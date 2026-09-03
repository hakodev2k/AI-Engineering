# Heroku MCP/API Connector

Reusable MCP server for Heroku application operations with a hybrid transport strategy: Heroku's official MCP server is preferred for capabilities it exposes, while narrowly scoped Heroku Platform API v3 calls provide stable fallbacks or fill capability gaps.

## Official sources researched

- Heroku Remote MCP Server: https://devcenter.heroku.com/articles/heroku-remote-mcp-server
- Heroku MCP Server STDIO Mode: https://devcenter.heroku.com/articles/heroku-mcp-server
- Official MCP implementation: https://github.com/heroku/heroku-mcp-server
- Platform API Reference: https://devcenter.heroku.com/articles/platform-api-reference
- Heroku limits: https://devcenter.heroku.com/articles/limits
- Config vars: https://devcenter.heroku.com/articles/config-vars
- Releases: https://devcenter.heroku.com/articles/releases

As of September 3, 2026, Heroku documents the remote MCP endpoint at `https://mcp.heroku.com/mcp` using OAuth 2.0. Heroku also publishes the STDIO `@heroku/mcp-server`, which can use `HEROKU_API_KEY`. This package is itself a stdio MCP server and launches the official STDIO server for selected Heroku-native operations; it does not proxy the interactive remote OAuth flow.

## Architecture

```text
MCP client
  -> this connector (stdio)
      -> policy / validation / approval gate
          -> official @heroku/mcp-server (stdio, preferred)
          -> Heroku Platform API v3 (fallback / gap fill)
```

The agent never receives the Heroku credential. `HEROKU_API_KEY` stays in connector configuration and transport headers/process environment.

## Runtime and installation

Requires Node.js 20+ and `npx` on PATH when official MCP is enabled.

```bash
npm install
npm run build
npm test
HEROKU_API_KEY=... npm start
```

By default the connector launches `npx -y @heroku/mcp-server`. Override `HEROKU_MCP_COMMAND` and comma-separated `HEROKU_MCP_ARGS` for controlled environments. `heroku mcp:start` can also be used outside this wrapper when you prefer Heroku CLI session authentication.

## Authentication and least privilege

Heroku recommends OAuth for third-party services. Personal/automation usage can authenticate Platform API calls with a Heroku authorization token in the `Authorization: Bearer` header. The official STDIO MCP server also supports `HEROKU_API_KEY`.

Heroku authorization tokens follow the permissions of the associated identity rather than offering fine-grained per-tool scopes. Use a dedicated Heroku user with access only to the teams/apps needed by this connector. Never put real tokens in configuration files committed to source control.

## Environment variables

- `HEROKU_API_KEY` — required authorization token.
- `HEROKU_API_BASE_URL` — default `https://api.heroku.com`.
- `HEROKU_MCP_COMMAND` — default `npx`.
- `HEROKU_MCP_ARGS` — default `-y,@heroku/mcp-server`.
- `HEROKU_USE_OFFICIAL_MCP` — default `true`.
- `HEROKU_TIMEOUT_MS` — 1,000–120,000; default 15,000.
- `HEROKU_MAX_RETRIES` — 0–5; default 2.
- `HEROKU_REQUIRE_WRITE_APPROVAL` — default `true`.
- `HEROKU_APPROVED_ACTIONS` — comma-separated exact approval fingerprints created outside the model prompt.

## Implemented tools

| Tool | Preferred transport | Risk | Approval |
|---|---|---|---|
| `heroku.app.list` | official MCP, REST fallback | READ | none |
| `heroku.app.get` | official MCP, REST fallback | READ | none |
| `heroku.app.create` | official MCP | WRITE | configurable, required by default |
| `heroku.dyno.list` | official MCP, REST fallback | READ | none |
| `heroku.dyno.restart` | official MCP | HIGH_RISK | explicit |
| `heroku.dyno.scale` | official MCP | HIGH_RISK | explicit |
| `heroku.addon.list` | official MCP, REST fallback | READ | none |
| `heroku.logs.get` | official MCP | READ | none |
| `heroku.pipeline.list` | official MCP | READ | none |
| `heroku.release.list` | Platform API | READ | none |
| `heroku.release.get` | Platform API | READ | none |
| `heroku.config.keys.list` | Platform API | READ | none |
| `heroku.config.update` | Platform API | HIGH_RISK | explicit |
| `heroku.maintenance.enable` | official MCP | HIGH_RISK | explicit |
| `heroku.maintenance.disable` | official MCP | HIGH_RISK | explicit |
| `heroku.rate_limit.get` | Platform API | READ | none |

The connector intentionally does not expose arbitrary Heroku CLI execution, arbitrary REST requests, database SQL execution, add-on provisioning, deployments, ownership transfers, app deletion, billing changes, or credential-management tools.

## Permission and approval model

READ tools may execute automatically. WRITE tools are approval-gated by default, and operators may disable that gate for ordinary writes. HIGH_RISK actions are always blocked unless their exact action fingerprint is present in `HEROKU_APPROVED_ACTIONS`; disabling ordinary write approval does not bypass this rule.

Examples:

```text
HEROKU_APPROVED_ACTIONS=heroku.app.create:example-app
HEROKU_APPROVED_ACTIONS=heroku.dyno.restart:example-app:web
HEROKU_APPROVED_ACTIONS=heroku.dyno.scale:example-app:web:3:standard-2x
HEROKU_APPROVED_ACTIONS=heroku.config.update:example-app:FEATURE_X+OLD_SETTING
```

Approval is external connector configuration, not a boolean tool argument, so an agent cannot self-approve by changing its request.

## Reliability and rate limits

Heroku Platform API currently documents a pool of 4,500 request tokens, replenished at roughly 75 per minute. Responses expose `RateLimit-Remaining`, and `/account/rate-limits` reports the remaining count without consuming the pool.

The REST client uses cancellation-backed timeouts and bounded exponential backoff for safe GET requests on transient network errors, HTTP 429, and 5xx responses. It honors `Retry-After` when present. Writes are not blindly retried. Authentication, permission, and validation errors are not retried.

Official MCP startup validates the presence of expected Heroku tools before use. Only a fixed allowlist of upstream MCP tools can be invoked; newly discovered upstream tools are not automatically trusted or exposed.

## Security considerations

- Provider credentials never enter tool schemas or returned content.
- App names, dyno names, process types, release identifiers, and config keys use strict validation.
- Config values are never returned by `heroku.config.keys.list` and are not echoed after updates.
- Third-party/provider content is treated as untrusted data and never as instructions.
- No arbitrary URL, CLI command, SQL, or raw API passthrough tool is exposed.
- High-impact operational changes require exact connector-controlled approval fingerprints.
- Use dedicated Heroku identities to limit blast radius because token privileges follow account access.
- Secrets should be supplied by environment or a secret manager and excluded from logs.

## Error handling

Platform API errors preserve HTTP status and Heroku `Request-Id` where available. Rate-limit retry delay is preserved when Heroku provides `Retry-After`. MCP failures on selected read operations fall back to the equivalent stable Platform API endpoint; operations without a verified safe fallback fail closed.

## Testing

```bash
npm test
npm run build
```

Tests use mocks and require no live credentials. They cover configuration validation, credential isolation, approval denial/allowance, high-risk gating, 429 read retry behavior, and non-retry of writes.

## Usage examples

See `examples/workflows.md`.

## Limitations

The official Heroku MCP toolset evolves independently of this wrapper. This connector deliberately exposes a small allowlisted subset and validates expected core tools at startup. Logs are delegated to Heroku MCP because logging behavior differs across Heroku generations and logging products. The remote `https://mcp.heroku.com/mcp` OAuth server is documented here but not nested inside this stdio connector; clients that support remote OAuth can connect to it directly.
