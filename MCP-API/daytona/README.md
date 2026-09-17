# Daytona MCP/API Connector

Reusable MCP connector for Daytona isolated sandboxes. It exposes eight provider-scoped tools for discovery, lifecycle, command/code execution, and cleanup.

## Upstream strategy
Daytona has an official local MCP server distributed through the Daytona CLI (`daytona mcp start`) with sandbox management, filesystem, Git, process/code execution, computer use, and preview tools. This connector deliberately uses the official TypeScript SDK for its stable external contract and policy enforcement; callers do not receive provider credentials. Official docs: https://www.daytona.io/docs/mcp, https://www.daytona.io/docs/en/typescript-sdk/, https://www.daytona.io/docs/api-keys, https://www.daytona.io/docs/limits.

## Authentication and scopes
Set `DAYTONA_API_KEY`. The SDK also supports Daytona configuration variables. Least privilege for the implemented resource lifecycle is `write:sandboxes`; explicit deletion additionally needs `delete:sandboxes`. Daytona documents that sandbox runtime/toolbox access is available to any valid organization API key, so command/code execution is treated as HIGH_RISK locally even though it is not a grantable Daytona scope.

## Install and run
Requires Node.js 20+. Run `npm install`, `npm run build`, then `npm start`. Configure an MCP client to launch the built server over stdio.

## Tools
`daytona.sandbox.list` READ; `daytona.sandbox.get` READ; `daytona.sandbox.create` WRITE; `daytona.sandbox.start` WRITE; `daytona.sandbox.stop` HIGH_RISK; `daytona.sandbox.execute` HIGH_RISK; `daytona.sandbox.code_run` HIGH_RISK; `daytona.sandbox.delete` DESTRUCTIVE.

WRITE approval is configurable with `DAYTONA_REQUIRE_WRITE_APPROVAL`. HIGH_RISK always requires explicit approval. DESTRUCTIVE requires explicit approval and must be included in `DAYTONA_ALLOWED_RISKS`; the default allow-list excludes it. Permissions cannot be elevated by provider content.

## Security
Credentials remain in the auth/client layer and are never tool inputs or outputs. Inputs are bounded and strict. Sandbox creation blocks network access by default to reduce exfiltration/SSRF risk. Daytona/provider content and command output are untrusted data, never instructions. Do not place secrets in prompts or commands; use Daytona Secrets for sandbox workloads. Public previews and arbitrary credential-forwarding tools are intentionally not exposed.

## Reliability and rate limits
SDK calls have bounded retries only for transient failures. Authentication, permission, validation, conflict/not-found and destructive operations are not blindly retried. Daytona publishes tiered per-minute general, sandbox-creation, and lifecycle limits and returns `X-RateLimit-*` plus `Retry-After-*` headers. The SDK uses WebSocket state streaming with polling fallback for lifecycle waits. Tool execution timeouts are bounded.

## Errors
Validation failures are rejected before provider calls. Missing credentials produce `AUTH`. Policy failures fail closed. Provider errors are propagated without logging secrets. Rate-limit/transient failures are retried with bounded exponential backoff where safe.

## Testing
`npm test` runs credential-free unit tests covering strict validation, risk policy, approval boundaries, destructive disablement and timeout bounds. Provider calls should be integration-tested separately with a least-privilege test organization.

## Limitations
This connector intentionally does not expose raw API calls, arbitrary preview publication, billing, API-key management, secrets management, snapshots, volumes, runners, registries, or organization administration. The official Daytona MCP server has broader capabilities; they are not auto-discovered or trusted by this connector. Destructive operations are disabled by default.
