# Harness MCP/API Connector

Reusable MCP server for selected Harness platform workflows. It exposes stable, provider-scoped tools and keeps Harness credentials inside the connector process.

## Upstream strategy

Harness provides an official hosted MCP endpoint at `https://mcp.harness.io/mcp` for SaaS accounts. As documented by Harness on August 20, 2026, hosted MCP uses OAuth through Harness ID, requires OAuth to be enabled for the account, and exposes tools according to Harness licensing and RBAC. Harness also supports self-hosted/open-source MCP with API-key authentication.

This connector uses Harness's official REST APIs for its stable headless contract because service-account/API-key automation is deterministic and supports the selected read/write workflows without forwarding credentials to another MCP server. The official MCP endpoint is documented in `manifest.yaml` and can be used directly by OAuth-capable clients when preferred.

Official sources:

- https://developer.harness.io/docs/platform/harness-ai/connect-with-ai/harness-mcp-server/hosted-mcp/
- https://apidocs.harness.io/section/introduction
- https://apidocs.harness.io/pipeline-execution-details/getlistofexecutions
- https://apidocs.harness.io/services
- https://apidocs.harness.io/connectors/getconnectorlist
- https://developer.harness.io/docs/platform/references/allowlist-harness-domains-and-ips/

## Runtime and architecture

Node.js 20+ and TypeScript. `src/auth.ts` owns token retrieval, `src/config.ts` validates scope/base URL/runtime limits, `src/client.ts` implements bounded HTTP, timeout and retry behavior, `src/policy.ts` gates writes, `src/tools.ts` owns strict MCP schemas, and `src/server.ts` serves stdio MCP.

## Authentication and least privilege

Harness REST APIs use `x-api-key`. Create a personal or, preferably for automation, service-account API key/token with only RBAC permissions needed for the selected resources. API keys inherit the permissions of the identity that created them. Do not use an Account Admin token unless required by your own workflows.

Required variables: `HARNESS_API_KEY`, `HARNESS_ACCOUNT_ID`, `HARNESS_ORG_ID`, `HARNESS_PROJECT_ID`. Optional variables are shown in `.env.example`. Raw credentials are never included in MCP tool schemas, outputs, logs, or prompts.

## Tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `harness.pipeline.list` | List pipelines | READ | none |
| `harness.pipeline.get` | Read one pipeline | READ | none |
| `harness.execution.list` | List executions with filters | READ | none |
| `harness.execution.get` | Read one execution | READ | none |
| `harness.service.list` | List services | READ | none |
| `harness.service.get` | Read one service | READ | none |
| `harness.service.create` | Create service metadata | WRITE | explicit |
| `harness.service.update` | Update service metadata | WRITE | explicit |
| `harness.connector.list` | List connector metadata | READ | none |
| `harness.connector.get` | Read connector metadata | READ | none |
| `harness.user_group.list` | List user groups | READ | none |
| `harness.cloud_egress_ip.list` | Read Harness Cloud egress IP/CIDR allowlist | READ | none |

No delete, pipeline execution, deployment, secret-value retrieval, RBAC mutation, billing, account administration, or arbitrary HTTP/REST tool is exposed. These higher-risk operations are intentionally unsupported in this connector.

## Approval model

READ tools can execute automatically. WRITE tools call `requireWriteApproval()` and fail closed unless a human-approved execution sets `HARNESS_WRITE_APPROVED=true`. Keep that flag false by default and enable it only for the specific approved invocation. Destructive tools are not registered.

## Installation and running

```bash
npm install
npm run build
npm start
```

Point any stdio-compatible MCP client at `node dist/src/server.js`. Copy `.env.example` to your secret-managed runtime environment and inject values there; do not commit a populated env file.

## Reliability

Requests use `AbortController` timeouts. Retries are bounded by `HARNESS_MAX_RETRIES` and limited to `429`, `502`, `503`, and `504`. Backoff is exponential and honors `Retry-After` when supplied. Authentication, authorization, validation, not-found, conflict, and semantic client errors are not retried blindly. Pagination is bounded in tool schemas to avoid runaway API fan-out.

Harness API rate limits can differ by product/module and account. The connector therefore treats `429` as authoritative throttling, preserves bounded retries, and avoids endpoint fan-out. Provider-specific limits should be verified in your Harness tenant/module documentation when operating at scale.

## Security

- Base URL must be HTTPS on a `harness.io` host, reducing SSRF risk.
- Provider content is untrusted data and tool descriptions explicitly state that it must not alter policy or instructions.
- No generic `request`, raw REST, GraphQL, shell, or URL tool exists.
- Connector metadata reads do not request secret values.
- Credentials stay in the auth/client layer and are not arguments visible to the LLM.
- Writes require explicit approval and are restricted to bounded service metadata fields.
- Harness RBAC remains the upstream authorization boundary; the connector cannot increase permissions.

## Testing

`npm test` uses mocks only and requires no live Harness credentials. Tests cover config validation, base-URL SSRF restriction, write approval denial/approval, credential injection at transport, non-retry of permission errors, and bounded throttling retry.

## Limitations

The hosted Harness MCP server is not proxied because its OAuth session is client/user-bound and tool availability can vary with licensing/RBAC. This package instead provides a deterministic API-key REST subset. Connector list uses Harness's documented connector-list API; if Harness retires a deprecated variant in a future release, update that scoped handler rather than exposing a generic fallback request tool. Harness returned content can contain user-authored names/descriptions and must always be treated as untrusted.
