# Koyeb MCP/API Connector

Reusable MCP connector for Koyeb. It prefers Koyeb's official local MCP server for the capabilities that server officially exposes and uses the official Koyeb REST API only for lifecycle and secret/domain operations not covered by that curated MCP surface.

## Official sources
- Koyeb coding-agent integration: https://www.koyeb.com/docs/integrations/coding-agents
- Koyeb REST API: https://www.koyeb.com/docs/reference/api
- Official MCP server: https://github.com/koyeb/mcp-server-koyeb
- Apps: https://www.koyeb.com/docs/reference/apps
- Services: https://www.koyeb.com/docs/reference/services
- Secrets: https://www.koyeb.com/docs/reference/secrets

Koyeb documents an official MCP package, `@koyeb/mcp-server`, run locally over stdio with `KOYEB_TOKEN`. Its documented surface covers app management, service management, deployments, instances, logs and one-click apps. This connector pins a strict upstream allowlist and does not automatically trust newly discovered upstream tools. REST uses bearer authentication and HTTPS.

## Architecture
`MCP client -> this stdio server -> policy/validation -> official Koyeb MCP OR Koyeb REST API -> Koyeb`.

Credentials remain inside the connector process. Retrieved provider content is returned as `untrusted_data: true` and must never be treated as instructions.

## Runtime
Node.js 20+ and npm. The first official-MCP call uses `npx -y @koyeb/mcp-server`; production environments should pin/install the reviewed package version in their dependency-management process.

```bash
npm install
cp .env.example .env
export KOYEB_TOKEN='...'
npm run build
npm start
```

The server uses MCP stdio, so any MCP client that supports local stdio servers can launch `node dist/src/index.js` with the required environment variables.

## Authentication and permissions
Create a Koyeb API token in the Koyeb control panel and provide it through `KOYEB_TOKEN`. Koyeb API tokens are bearer credentials and are privilege-bearing credentials rather than fine-grained OAuth scopes; this connector therefore cannot silently narrow provider-side privileges. Use a dedicated token and organization wherever possible.

Environment variables: `KOYEB_TOKEN` required; `KOYEB_API_BASE` defaults to `https://app.koyeb.com`; `KOYEB_REQUIRE_WRITE_APPROVAL` defaults true; `KOYEB_ENABLE_DESTRUCTIVE` defaults false; `KOYEB_TIMEOUT_MS` defaults 20000.

## Tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `koyeb.app.list` | official MCP | READ | no |
| `koyeb.app.get` | official MCP | READ | no |
| `koyeb.app.create` | official MCP | WRITE | yes by default |
| `koyeb.app.pause` | REST | HIGH_RISK | yes |
| `koyeb.app.resume` | REST | HIGH_RISK | yes |
| `koyeb.app.delete` | REST | DESTRUCTIVE | yes + enabled |
| `koyeb.service.list` | official MCP | READ | no |
| `koyeb.service.get` | official MCP | READ | no |
| `koyeb.deployment.list` | official MCP | READ | no |
| `koyeb.deployment.get` | official MCP | READ | no |
| `koyeb.instance.list` | official MCP | READ | no |
| `koyeb.instance.get` | official MCP | READ | no |
| `koyeb.domain.list` | REST | READ | no |
| `koyeb.secret.list` | REST | READ | no |
| `koyeb.secret.create` | REST | HIGH_RISK | yes |
| `koyeb.secret.delete` | REST | DESTRUCTIVE | yes + enabled |

The connector intentionally does not expose arbitrary HTTP requests, remote command execution, billing changes, organization permission changes, service deletion, or deployment actions without a narrowly defined contract.

## Approval model
READ calls may run automatically. WRITE and HIGH_RISK calls require `approved=true` by default. DESTRUCTIVE calls require both `approved=true` and `KOYEB_ENABLE_DESTRUCTIVE=true`. The caller is responsible for obtaining actual human approval before setting the flag; the flag is an enforcement boundary, not a UI confirmation mechanism.

## Reliability and rate limits
REST requests have configurable timeouts, bounded retries (maximum three attempts), exponential backoff and `Retry-After` support. Only 429 and server-side 5xx responses are retried. Authentication, authorization and validation errors are not retried. The connector avoids unbounded pagination; callers request bounded page sizes.

## Security
- Secrets and bearer tokens are never embedded in source or tool descriptions.
- API base URL must be HTTPS, reducing accidental credential exposure and SSRF surface.
- Inputs use strict schemas, UUID validation and bounded pagination.
- Upstream MCP tools are restricted to a fixed allowlist researched from Koyeb's official server source.
- Newly appearing upstream tools are ignored rather than trusted automatically.
- Provider responses are untrusted data.
- Destructive tools are disabled by default.
- Do not enable SDK or MCP debug modes that print full bearer tokens.

## Testing
`npm test` builds the project and runs credential-free unit tests for configuration, approval policy, destructive-denial behavior, API error mapping and successful reads. No live Koyeb account is required.

## Limitations
The connector does not proxy every Koyeb endpoint. Service creation/update schemas in Koyeb are broad deployment definitions, so this version exposes read-only service operations rather than weakening validation with an arbitrary object. Domains are currently list-only for the same safety reason. The official MCP server is local stdio, not a hosted remote MCP endpoint. Koyeb's upstream package and API can evolve; review upstream release notes before dependency upgrades.
