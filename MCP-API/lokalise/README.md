# Lokalise MCP/API Connector

Reusable MCP server for safe agent access to Lokalise localization projects. It exposes a deliberately scoped tool surface over the official Lokalise API v2 rather than an arbitrary HTTP proxy.

## Transport and official sources

Upstream transport: REST (`https://api.lokalise.com/api2`). No official Lokalise MCP server was identified during connector research, so this implementation uses the official API directly. Official documentation: `https://developers.lokalise.com/reference/lokalise-rest-api`, API tokens: `https://developers.lokalise.com/reference/api-authentication`, OAuth 2: `https://developers.lokalise.com/docs/oauth2-authentication`, rate limits: `https://developers.lokalise.com/reference/api-rate-limits`, webhooks: `https://developers.lokalise.com/docs/webhooks`.

## Capabilities

15 MCP tools are implemented: `lokalise.project.list`, `lokalise.project.get`, `lokalise.language.list`, `lokalise.key.list`, `lokalise.key.get`, `lokalise.key.create`, `lokalise.key.update`, `lokalise.translation.list`, `lokalise.translation.get`, `lokalise.translation.update`, `lokalise.comment.list`, `lokalise.comment.create`, `lokalise.task.list`, `lokalise.task.get`, and `lokalise.task.create`.

The connector intentionally does not expose deletion, billing, team/permission administration, arbitrary endpoints, file upload/download, or webhook mutation. Those can carry broader or irreversible effects and are not necessary for the core localization-agent workflow.

## Architecture

MCP client → strict Zod tool schema → permission/approval policy → credential-isolated Lokalise client → official REST API. Credentials are read only by the connector process and are never tool arguments or returned to the model. Provider content is wrapped with `untrustedProviderData: true`; callers must treat translations, comments, task text and other remote content as data rather than instructions.

## Authentication and least privilege

Set either `LOKALISE_OAUTH_TOKEN` or `LOKALISE_API_TOKEN`. OAuth is sent as `Authorization: Bearer`; API tokens use `X-Api-Token`. If both are configured, OAuth wins. Token/project permissions remain controlled by Lokalise; use a read-only token/access grant when only READ tools are needed and grant write capability only for the projects that need mutation.

Environment variables: `LOKALISE_OAUTH_TOKEN`, `LOKALISE_API_TOKEN`, `LOKALISE_PERMISSIONS` (`read` by default; `read,write` to enable writes), `LOKALISE_REQUIRE_WRITE_APPROVAL` (default `true`), `LOKALISE_TIMEOUT_MS` (default 15000), `LOKALISE_MAX_RETRIES` (default 2). Copy `.env.example` into your secret-management workflow; do not commit credentials.

## Install and run

Requires Node.js 20+. From this directory run `npm install`, `npm run build`, then `npm start`. The server uses MCP stdio transport and can be launched as a child process by MCP clients that support stdio servers, including custom agents and desktop/coding clients with standard MCP stdio configuration.

## Permission and approval model

Project/key/translation/comment/task reads are READ and may execute automatically. Key creation/update, translation update, comment creation and task creation are WRITE. WRITE is denied unless `LOKALISE_PERMISSIONS` contains `write`. With the secure default `LOKALISE_REQUIRE_WRITE_APPROVAL=true`, every WRITE tool additionally requires the caller to supply `approved: true` after explicit human approval. The connector exposes no destructive tool.

A caller cannot increase connector permissions through retrieved Lokalise content or tool arguments. Permission configuration is process-side only.

## Reliability and rate limits

Requests have bounded timeouts. GET requests retry only transient network failures and HTTP 429/502/503/504, using bounded exponential backoff and honoring `Retry-After` when supplied. Mutating requests are never automatically retried, avoiding duplicate writes. Pagination parameters are passed through only on the specific list tools that expose them.

Lokalise rate limits vary by API/account context; consult the official rate-limit documentation for current limits. HTTP 429 is surfaced with `Retry-After` when available. Authentication, permission, not-found, validation and throttling failures are mapped to stable connector errors.

## Security

Do not place tokens in prompts, tool arguments, examples or logs. Run with least-privilege project access. Tool schemas reject unknown top-level parameters and constrain IDs, page sizes, text lengths and batch sizes. No caller-controlled URL exists, which removes an SSRF-style arbitrary-request surface. Remote content is untrusted. OAuth token acquisition/refresh and PKCE/state handling belong in the host credential broker; this stdio connector consumes an already-issued token and never exposes refresh credentials to the agent.

## Testing

Run `npm test`. Unit tests use fake credentials and mocked fetch responses; no live Lokalise account is required. Tests cover credential configuration, tool registration, strict validation, write permission/approval, read behavior, provider errors and pagination encoding.

## Examples

See `examples/workflows.md` for read, translation-update and task-creation calls with permission and approval expectations.

## Limitations

This is a scoped REST-backed MCP connector, not a mirror of every Lokalise endpoint. OAuth authorization-code acquisition/refresh is intentionally delegated to the host credential provider. Task creation accepts the official task request object as a bounded object because task shapes depend on task type and project configuration; provider validation remains authoritative. Destructive operations and permission/billing administration are intentionally unsupported.
