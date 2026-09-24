# Temporal MCP/API Connector

Reusable stdio MCP server for Temporal workflow operations using Temporal's official TypeScript SDK (`@temporalio/client`). Research on 2026-09-24 found no Temporal-operated MCP server in official Temporal documentation, so the official SDK is the upstream transport rather than an unofficial MCP implementation.

## Official sources
- Temporal documentation: https://docs.temporal.io/
- TypeScript SDK client guide: https://docs.temporal.io/develop/typescript/temporal-client
- TypeScript SDK API: https://typescript.temporal.io/
- Temporal Cloud API keys: https://docs.temporal.io/cloud/api-keys

## Capabilities
Nine stable MCP tools: list, describe, fetch history, query, start, signal, cancel, terminate, and signal-with-start. Arbitrary Temporal service RPCs are not exposed. Worker deployment, namespace administration, schedules, billing and destructive namespace operations are intentionally outside this connector.

## Authentication and configuration
`TEMPORAL_ADDRESS` identifies the Temporal frontend (Cloud commonly uses a namespace endpoint; local default is `localhost:7233`). `TEMPORAL_NAMESPACE` defaults to `default`. `TEMPORAL_API_KEY` is passed only inside the official SDK connection layer and never accepted as a tool argument. Set `TEMPORAL_TLS=true` for Temporal Cloud/API-key connections. For deployments requiring client certificates, extend the credential provider locally rather than placing certificates in prompts or tool inputs.

Use the narrowest Temporal Cloud account/namespace permissions available to the service identity. API keys inherit the permissions of their associated service account/user, so least privilege is configured in Temporal Cloud IAM rather than as OAuth scopes.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run build
TEMPORAL_ADDRESS=your.namespace.tmprl.cloud:7233 TEMPORAL_NAMESPACE=your-namespace TEMPORAL_API_KEY=... TEMPORAL_TLS=true npm start
```
The server implements MCP over stdio and can be launched by any MCP client that supports stdio subprocess servers.

## Permission model
READ: `temporal.workflow.list`, `.describe`, `.history`, `.query`. WRITE: `.start`, `.signal`. HIGH_RISK: `.cancel`, `.terminate`, `.signal_with_start`. Writes are disabled unless `TEMPORAL_ALLOW_WRITES=true`. HIGH_RISK calls additionally require a per-call HMAC approval token generated outside the LLM from `TEMPORAL_APPROVAL_SECRET`. No DESTRUCTIVE tool is exposed.

Cancellation requests allow Workflow cleanup logic; termination immediately stops an execution and is therefore HIGH_RISK. Signal-with-start can create a new execution and mutate it atomically, so it is also HIGH_RISK.

## Reliability
Operations use the official Temporal SDK, which owns service connection behavior. The connector adds a bounded application timeout for point operations and bounded workflow-list collection. It does not blindly retry mutations: Temporal SDK/service semantics and workflow IDs provide Temporal's normal deduplication guarantees. Errors are returned as MCP errors without credentials. List pagination is consumed lazily and capped by `pageSize`.

## Security
Credentials remain in environment/configuration and the SDK connection. Tool schemas reject unknown fields and bound identifiers, query strings, argument counts and page size. Provider/workflow results are marked untrusted data; Workflow memo/search attributes/history/query results must never be interpreted as instructions or permission changes. No arbitrary network URL or raw gRPC/API request tool is exposed. Approval secrets must be supplied through a secret manager and must not be shared with the model.

## Rate limits
Temporal Cloud protects service capacity with namespace/account limits and may throttle requests. Exact limits depend on Cloud configuration and workload. This connector avoids fan-out, caps list results, and relies on the official SDK's service error handling. If throttling occurs, reduce caller concurrency rather than retrying high-risk mutations blindly.

## Testing
`npm test` builds the connector and runs credential-free unit tests for tool registration, strict validation, write denial, signed high-risk approval, and configuration isolation. Live Temporal credentials are not required.

## Limitations
Workflow arguments/results must be compatible with Temporal's configured data converter; this connector uses the SDK default converter. Query names and signal names are application-defined. The connector does not start Workers and cannot guarantee a Worker exists for a requested workflow type/task queue. mTLS certificate loading is not implemented in this reusable package; API-key/TLS and local/self-hosted endpoint configurations are supported by design.
