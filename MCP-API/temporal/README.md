# Temporal MCP/API Connector

Reusable MCP connector for Temporal Workflow execution and Schedule operations using the official Temporal TypeScript SDK.

## Official sources researched

- Temporal documentation: https://docs.temporal.io/
- Temporal TypeScript SDK API reference: https://nodejs.temporal.io/
- Temporal platform changelog: https://temporal.io/changelog
- Temporal Platform Hub AI tooling, including the Temporal Docs MCP Server: https://go.temporal.io/platform-hub/getting-started

Research date: 2026-08-28.

## MCP availability and transport strategy

Temporal documents a **Temporal Docs MCP Server** for giving coding agents live access to Temporal documentation. That server is for documentation access rather than general operational management of Workflow Executions and Schedules.

For real provider operations, this connector uses the official `@temporalio/client` SDK. The connector itself exposes the stable MCP tools and keeps the upstream Temporal endpoint, Namespace, and credentials fixed at process startup.

## Supported capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---|---|
| `temporal.workflow.list` | official TypeScript SDK | READ | no |
| `temporal.workflow.describe` | official TypeScript SDK | READ | no |
| `temporal.workflow.start` | official TypeScript SDK | HIGH_RISK | yes |
| `temporal.workflow.signal` | official TypeScript SDK | HIGH_RISK | yes |
| `temporal.workflow.query` | official TypeScript SDK | READ | no |
| `temporal.workflow.cancel` | official TypeScript SDK | DESTRUCTIVE | yes + feature flag |
| `temporal.workflow.terminate` | official TypeScript SDK | DESTRUCTIVE | yes + feature flag |
| `temporal.schedule.list` | official TypeScript SDK | READ | no |
| `temporal.schedule.describe` | official TypeScript SDK | READ | no |
| `temporal.schedule.pause` | official TypeScript SDK | HIGH_RISK | yes |
| `temporal.schedule.unpause` | official TypeScript SDK | HIGH_RISK | yes |
| `temporal.schedule.delete` | official TypeScript SDK | DESTRUCTIVE | yes + feature flag |

The implementation deliberately does not expose arbitrary gRPC requests, raw Workflow Service calls, Namespace administration, API-key administration, Worker deployment, or billing controls.

## Architecture

```text
MCP client / agent
        |
        v
Temporal connector (stdio MCP)
  - strict tool allowlist
  - bounded list sizes
  - payload-bound approvals
  - destructive feature gate
        |
        v
official @temporalio/client SDK
        |
        v
Temporal Cloud or self-hosted Temporal Service
```

Provider-returned data is marked `untrusted_provider_data: true` and must be treated as data, never as agent instructions.

## Authentication

For Temporal Cloud, configure an API key and TLS:

```text
TEMPORAL_ADDRESS=<namespace endpoint host>:7233
TEMPORAL_NAMESPACE=<namespace>
TEMPORAL_API_KEY=<api key>
TEMPORAL_TLS=true
```

Credentials live only in the connector environment. They are never accepted as MCP tool arguments and never returned to the model.

For self-hosted local development, plaintext transport is allowed only to `localhost`, `127.0.0.1`, or `[::1]` with:

```text
TEMPORAL_TLS=false
```

`TEMPORAL_SERVER_NAME_OVERRIDE` is available for TLS setups that require an explicit server-name override.

## Least privilege

Use a dedicated Temporal principal/API key with the minimum Namespace access required for the configured Namespace. Do not reuse broad account-owner or infrastructure credentials. This connector never changes permissions or authentication configuration at runtime.

## Environment variables

- `TEMPORAL_ADDRESS` — required `host:port`.
- `TEMPORAL_NAMESPACE` — required fixed Namespace.
- `TEMPORAL_API_KEY` — API key for Temporal Cloud or compatible deployments.
- `TEMPORAL_TLS` — defaults to `true`.
- `TEMPORAL_SERVER_NAME_OVERRIDE` — optional TLS server-name override.
- `TEMPORAL_TIMEOUT_MS` — local operation wait bound; default `10000`.
- `TEMPORAL_APPROVAL_SECRET` — HMAC key used to validate approved mutations.
- `TEMPORAL_ENABLE_DESTRUCTIVE` — defaults to `false`.

## Installation

Requires Node.js 20+.

```bash
npm install
npm run check
npm test
```

## Running the MCP server

```bash
npm start
```

The server uses MCP stdio transport and is suitable for standard MCP clients that support stdio tool discovery and invocation.

## Permission and approval model

READ tools may execute automatically.

`workflow.start`, `workflow.signal`, `schedule.pause`, and `schedule.unpause` are classified `HIGH_RISK` because they can trigger or alter real business processing. They require an explicit approval token.

`workflow.cancel`, `workflow.terminate`, and `schedule.delete` are classified `DESTRUCTIVE`, are disabled by default, and additionally require:

```text
TEMPORAL_ENABLE_DESTRUCTIVE=true
```

The approval token is bound to the exact tool and payload:

```text
hex(HMAC-SHA256(
  TEMPORAL_APPROVAL_SECRET,
  "<tool-name>\n<stable canonical JSON payload without approval_token>"
))
```

Changing a Workflow ID, Signal name, arguments, Schedule ID, or termination reason invalidates the approval. The agent cannot enable destructive mode through a tool call.

## Reliability and rate limiting

Temporal itself provides durable command and execution semantics. The connector adds bounded local waits and intentionally avoids blind connector-level retries for state-changing operations. Workflow and Schedule listings are bounded by both page size and maximum returned results.

Temporal Cloud service limits can vary by account and Namespace, and the platform has evolved APS-based rate limiting. This connector therefore does not invent a universal fixed requests-per-second number. Resource-exhaustion or throttling errors are classified as retryable for the caller to back off deliberately.

The connector also normalizes common authorization, timeout, not-found, and rate/resource exhaustion errors at the MCP boundary.

## Security considerations

- Credentials remain inside the connector configuration layer.
- Connection target and Namespace are fixed at startup.
- TLS is mandatory except explicitly configured localhost development.
- No arbitrary API/gRPC execution tool exists.
- High-impact actions require payload-bound human approval.
- Destructive tools are disabled by default.
- Provider data is untrusted.
- Tool schemas bound argument counts, query length, list page sizes, and output count.
- Avoid passing secrets in Workflow arguments, Memo, Search Attributes, Query results, Signal arguments, or logs.
- Retrieved Workflow data can never alter connector permissions or enable tools.

## Testing

Tests require no live Temporal credentials. They use fakes and cover:

- authentication/configuration validation;
- TLS safety;
- tool registration and policy synchronization;
- read permission behavior;
- write approval and payload binding;
- destructive-operation denial;
- fixed Namespace/API-key connection configuration;
- bounded Workflow listing;
- Signal and terminate dispatch;
- Schedule pause/unpause/delete dispatch.

Run:

```bash
npm test
```

## Limitations

- Operational calls use the official TypeScript SDK rather than the Temporal Docs MCP Server.
- This connector does not run Workers; Workflow and Activity implementations remain in application projects.
- It does not expose raw Workflow histories, protobuf/gRPC access, Namespace administration, Cloud user management, API-key management, or billing/admin APIs.
- Cancellation is cooperative; termination is forceful and intentionally gated.
- The local timeout bounds how long the MCP caller waits but cannot forcibly cancel every in-flight SDK operation.
