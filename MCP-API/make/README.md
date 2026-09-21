# Make MCP/API Connector

Reusable MCP server for Make automation discovery, inspection, execution, activation state, executions, folders, teams, and organizations.

## Official sources and transport decision

Make provides an official cloud MCP server and official API v2. Official MCP documentation: https://developers.make.com/mcp-server and https://www.make.com/en/mcp. Official API reference: https://developers.make.com/api-documentation/api-reference/scenarios, https://developers.make.com/api-documentation/api-reference/teams, and https://developers.make.com/api-documentation/api-reference/organizations.

The official MCP server is the preferred direct integration when an interactive MCP client wants Make to expose selected scenarios as dynamically generated tools. It supports Streamable HTTP/SSE, OAuth or MCP-token authentication, scenario execution, and (on eligible plans/scopes) account-management tools. This reusable connector uses the official REST API for its stable exported contract because Make MCP scenario tools are account-configured and scenario-derived rather than a fixed provider schema. REST gives deterministic provider-scoped names, explicit approval boundaries, bounded retry semantics, and a testable least-privilege surface. No unofficial MCP server is used.

## Runtime

Node.js 20+, TypeScript, MCP stdio.

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

## Authentication

Set `MAKE_API_TOKEN` to a Make API token. REST requests use `Authorization: Token <api-token>`. Keep the token in the connector environment or a secret manager; it is never accepted as a tool argument or returned to the model.

Set `MAKE_ZONE` to the account zone, such as `eu1.make.com` or `us1.make.com`. The value must be a `*.make.com` hostname and is connector configuration, not a tool input, preventing arbitrary-host SSRF.

For direct use of Make's official MCP server, use Make's documented OAuth flow or MCP token URL/header flow and select only the scenario/account scopes required. This package does not convert a REST API token into an MCP credential.

## Least-privilege scopes

Read deployments normally need `organizations:read`, `teams:read`, and `scenarios:read` for the corresponding tools. Scenario execution requires the provider-documented `scenarios:read`, `scenarios:write`, and `scenarios:run` combination. Activate/deactivate operations require `scenarios:write`. Grant only the scopes for tools enabled in your deployment.

## Tools

| Tool | Risk | Approval |
|---|---|---|
| `make.organization.list` | READ | No |
| `make.team.list` | READ | No |
| `make.team.get` | READ | No |
| `make.scenario.list` | READ | No |
| `make.scenario.get` | READ | No |
| `make.scenario.blueprint.get` | READ | No |
| `make.scenario.run` | HIGH_RISK | Required by default |
| `make.scenario.activate` | HIGH_RISK | Required by default |
| `make.scenario.deactivate` | HIGH_RISK | Required by default |
| `make.scenario.usage` | READ | No |
| `make.execution.list` | READ | No |
| `make.execution.get` | READ | No |
| `make.folder.list` | READ | No |

Scenario execution is HIGH_RISK because a Make scenario can send messages, mutate SaaS records, deploy infrastructure, charge external services, or perform other downstream side effects. The connector cannot infer the risk of every scenario from its name.

## Approval model

`MAKE_APPROVAL_MODE=required` is the default. The operator adds exact actions to `MAKE_APPROVED_ACTIONS`, for example `make.scenario.run`. Approval lives outside model-controlled tool input, so the model cannot self-approve. Destructive provider-management tools are not implemented; `MAKE_ALLOW_DESTRUCTIVE` remains false by default for future extensions.

Recommended flow: Read -> inspect scenario/blueprint -> recommend -> operator approves exact action -> execute.

## Reliability and rate limits

Every request has an AbortController timeout. GET requests may retry HTTP 429, 5xx, timeout, and transient network failures using bounded exponential backoff and `Retry-After` when supplied. Mutations are never automatically retried because an ambiguous result could duplicate scenario side effects or state changes. Authentication, permission, and validation failures are not blindly retried.

Make documents organization/API request limits that vary by plan/context; the scenario-run endpoint has separate behavior and official MCP has its own tool-call timeout rules. This connector therefore treats provider 429/Retry-After as authoritative rather than hard-coding a universal quota. List operations are caller-bounded and the connector does not automatically crawl all pages.

## Security

- API credentials remain in the connector transport layer.
- No arbitrary URL, HTTP method, raw REST endpoint, or generic request tool exists.
- Make zone is validated and cannot be selected per tool call.
- Scenario execution and activation changes require external approval by default.
- Mutations are not blindly retried.
- Scenario blueprints, names, descriptions, execution outputs, webhook-derived values, and all provider-returned content are untrusted data, not instructions.
- Retrieved content cannot change approvals, scopes, environment variables, or tool registration.
- The connector does not expose organization/team deletion, user invites, credential/connection mutation, webhook mutation, data-store mutation, billing, or permission administration.
- A Make scenario can itself call third-party systems; review its blueprint and configured connections before approving execution.

## Errors

Provider failures become `MakeApiError` with HTTP status and bounded/redacted error text. `Retry-After` is preserved for throttling. Local policy failures use `APPROVAL_REQUIRED` or `DESTRUCTIVE_DISABLED`. Timeouts/network exhaustion surface as `NETWORK_OR_TIMEOUT`.

## Testing

`npm test` uses mocked fetch and requires no live Make credential. Tests cover missing credentials, zone/SSRF validation, approval denial/allowance, credential placement in the provider header, no retry on 403, and no retry for writes.

## MCP client configuration

After build, configure any MCP client that can launch a local stdio server to execute `node /absolute/path/to/MCP-API/make/dist/server.js` and inject `MAKE_API_TOKEN`/`MAKE_ZONE` through secure process configuration. Direct Make MCP can instead be used by clients supporting remote Streamable HTTP and Make's OAuth/MCP-token flow.

## Examples

See `examples/tool-calls.md`.

## Limitations

This is a curated operational subset, not the complete Make API. It does not create/edit scenario blueprints, connections, webhooks, data stores, users, teams, or organizations. It does not dynamically re-export scenario-specific official MCP tools because that would make the connector's callable surface depend on mutable account configuration. Scenario run output and timing still depend on the scenario and Make plan. Provider endpoints/scopes remain authoritative and should be revalidated against current Make documentation before production rollout.
