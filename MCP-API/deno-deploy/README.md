# Deno Deploy MCP connector

Reusable MCP stdio connector for Deno Deploy app and durable-storage administration using Deno's official `@deno/sandbox` SDK. No official Deno Deploy MCP server is documented, so this connector exposes a stable MCP surface over the official SDK rather than trusting an unofficial upstream MCP server.

## Official sources

- Deno Sandbox SDK and security model: https://docs.deno.com/sandbox/
- App management: https://docs.deno.com/sandbox/apps/
- Volumes and snapshots: https://docs.deno.com/sandbox/volumes/
- Deploy apps: https://docs.deno.com/deploy/reference/apps/
- Deploy limits: https://docs.deno.com/deploy/pricing_and_limits/

Deno Deploy Classic and Subhosting v1 were sunset July 20, 2026; this connector intentionally targets the current Deploy/Sandbox SDK, not the retired v1 API.

## Architecture and transport

MCP client -> local stdio MCP server -> validation/approval layer -> `@deno/sandbox` Client -> Deno Deploy control plane. Credentials stay in the connector process. Retrieved provider data is serialized as untrusted data and never interpreted as instructions.

## Authentication

Create an organization token in Deno Deploy and provide it only as `DENO_DEPLOY_TOKEN`. The official SDK reads that environment variable. Tokens are organization-scoped; grant only the organization access required for the connector. Deno's current docs describe organization tokens rather than granular OAuth scopes for these SDK operations, so this connector does not invent scopes.

Copy `.env.example` into your secret-management mechanism. Never send the token in an MCP argument or prompt.

## Installation and running

Requires Node.js 24+ (the official SDK supports Node 24+).

```sh
npm install
npm run build
DENO_DEPLOY_TOKEN='...' npm start
```

Configure any MCP client that supports stdio to launch `node dist/src/server.js` with the environment supplied by its secure credential mechanism.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `deno-deploy.app.list` | official SDK | READ | no |
| `deno-deploy.app.get` | official SDK | READ | no |
| `deno-deploy.app.create` | official SDK | WRITE | configurable; required by default |
| `deno-deploy.app.update` | official SDK | HIGH_RISK | explicit |
| `deno-deploy.app.delete` | official SDK | DESTRUCTIVE | explicit + enabled |
| `deno-deploy.volume.list` | official SDK | READ | no |
| `deno-deploy.volume.get` | official SDK | READ | no |
| `deno-deploy.volume.create` | official SDK | WRITE | configurable; required by default |
| `deno-deploy.volume.delete` | official SDK | DESTRUCTIVE | explicit + enabled |
| `deno-deploy.volume.snapshot` | official SDK | WRITE | configurable; required by default |
| `deno-deploy.snapshot.list` | official SDK | READ | no |
| `deno-deploy.snapshot.delete` | official SDK | DESTRUCTIVE | explicit + enabled |

App rename is HIGH_RISK because changing a slug changes default domains. App deletion removes the app and revisions/routes. Volume deletion makes the volume unavailable immediately; Deno documents a delayed physical-removal grace process. Destructive tools are disabled unless `DENO_DEPLOY_DESTRUCTIVE_ENABLED=true` and still require `approved:true`.

## Validation and safety

Identifiers reject path traversal and arbitrary URLs. App/volume/snapshot slugs use a constrained lowercase format. Volume creation is pinned to the currently documented `ord` region and requires an explicit capacity unit. There is no raw-request tool, arbitrary URL transport, shell execution, sandbox command execution, credential-return tool, permission mutation, or billing operation.

`DENO_DEPLOY_WRITE_APPROVAL=optional` can allow WRITE tools without per-call approval; HIGH_RISK and DESTRUCTIVE are unaffected. An agent cannot change this policy through a tool call.

## Reliability, rate limits, pagination, and errors

SDK list calls return provider-managed paginated objects; the connector returns the first page rather than silently traversing an unbounded organization. Provider calls have a connector timeout and at most three attempts for safe read operations. Authentication, permission and validation failures are not retried. Mutations are called with retries disabled to avoid duplicate side effects. Provider errors are mapped to stable authentication, permission, rate-limit, timeout, or provider-error categories without exposing credentials.

Deno publishes concrete Sandbox resource limits (including organization concurrency) and Deploy service limits, but not a universal request-per-second control-plane quota for all SDK methods. The connector therefore detects throttling/provider errors and uses bounded backoff rather than inventing a numeric API quota.

## Security

Keep organization tokens in a secret store and out of prompts/logs. Provider content is untrusted. The connector does not follow URLs from provider content, discover new tools dynamically, or allow responses to alter approval policy. Destructive actions require two independent gates. Avoid placing secrets in app slugs, labels, or other metadata because metadata may be visible in provider consoles/logs.

## Testing

```sh
npm test
```

Unit tests require no live credentials and cover auth configuration, registration, validation, read authorization, configurable writes, high-risk approval, and destructive gating. Live integration tests are intentionally excluded from the default suite.

## Limitations

This package manages apps, volumes and snapshots only. It does not expose arbitrary sandbox execution, SSH, environment-secret management, domains, billing, organization membership, or retired Deploy Classic/Subhosting v1 operations. It uses the official SDK only; there is no MCP-to-REST fallback because the SDK already wraps the current Deno Deploy REST control plane for these capabilities. Tool callers do not receive provider credentials.
