# Argo CD MCP/API Connector

Reusable MCP connector for Argo CD. It exposes a focused set of GitOps inspection and deployment capabilities through stable MCP tools while keeping the Argo CD bearer token inside the connector process.

## Upstream transport

This connector uses the official Argo CD REST API exposed by `argocd-server`. No official Argo CD MCP server was identified during implementation, so there is no unofficial MCP dependency. The Argo CD API publishes Swagger/OpenAPI documentation at `/swagger-ui` on each server.

Official references:

- API docs: https://argo-cd.readthedocs.io/en/stable/developer-guide/api-docs/
- Security/authentication: https://argo-cd.readthedocs.io/en/latest/operator-manual/security/
- User/API account guidance: https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/
- Current application service API definitions: https://github.com/argoproj/argo-cd/blob/master/server/application/application.proto
- Current generated Swagger: https://github.com/argoproj/argo-cd/blob/master/assets/swagger.json

## Architecture

```text
MCP client
   -> stable argocd.* tool
   -> validation + allowlist + approval policy
   -> ArgoCdClient
   -> Authorization: Bearer <ARGOCD_TOKEN>
   -> official Argo CD REST API
```

Provider responses are wrapped as `untrustedProviderData: true`; retrieved manifests, events, metadata and other provider content must be treated as data rather than instructions.

## Requirements

- Node.js 20+
- Network access to an Argo CD API server
- Argo CD bearer JWT/API token with only the RBAC permissions needed by the enabled workflows

## Authentication and permissions

Argo CD authenticates API requests with JWT bearer tokens. Prefer a dedicated automation/local account or a project role token instead of the built-in admin identity. Project role tokens can be scoped through Argo CD RBAC and revoked independently.

The connector does not implement username/password login and never passes the token to MCP callers. Configure the token only through `ARGOCD_TOKEN`.

Argo CD authorization is RBAC-based, not OAuth-scope-based. Grant the service identity only the actions needed, for example read access to applications/projects/repositories/clusters, plus `sync` only when deployment execution is required.

## Environment

Copy `.env.example` and configure:

- `ARGOCD_SERVER_URL` — Argo CD server base URL, normally HTTPS.
- `ARGOCD_TOKEN` — bearer JWT/API token. Required.
- `ARGOCD_ALLOWED_PROJECTS` — optional comma-separated project allowlist.
- `ARGOCD_ALLOWED_APPLICATIONS` — optional comma-separated application allowlist.
- `ARGOCD_APPROVAL_SECRET` — secret used to verify explicit approval for high-risk tools.
- `ARGOCD_TIMEOUT_MS` — request timeout, default `15000`, allowed `1000..120000`.
- `ARGOCD_MAX_RETRIES` — bounded retries for safe GET requests, default `3`, maximum `5`.
- `ARGOCD_ALLOW_INSECURE_TLS` — when `true`, permits a non-HTTPS server URL for controlled local/dev environments. It does not disable Node TLS certificate verification.

TLS is required by default. Do not use plain HTTP outside an explicitly isolated development environment.

## Installation

```bash
npm install
npm run build
```

Run over MCP stdio:

```bash
npm start
```

Any MCP client that supports a local stdio MCP server can launch this process. Compatibility depends on the client's standard MCP stdio support; no vendor-specific client integration is required by the connector.

## Implemented tools

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `argocd.application.list` | REST | READ | No | List visible applications with optional project/namespace/selector/repository filters. |
| `argocd.application.get` | REST | READ | No | Read application metadata, health and sync status. |
| `argocd.application.resource_tree` | REST | READ | No | Inspect managed Kubernetes resource topology. |
| `argocd.application.manifests` | REST | READ | No | Retrieve generated application manifests. |
| `argocd.application.events` | REST | READ | No | Retrieve application/resource Kubernetes events. |
| `argocd.application.sync_windows` | REST | READ | No | Inspect sync windows affecting an application. |
| `argocd.application.revision_metadata` | REST | READ | No | Read author/date/tags/message metadata for a revision. |
| `argocd.project.list` | REST | READ | No | List visible Argo CD projects. |
| `argocd.project.get` | REST | READ | No | Read one project. |
| `argocd.repository.list` | REST | READ | No | List repository configuration visible through Argo CD; secrets are redacted by Argo CD. |
| `argocd.cluster.list` | REST | READ | No | List clusters visible to the identity; credentials are redacted by Argo CD. |
| `argocd.application.sync` | REST | HIGH_RISK | Yes | Trigger a GitOps synchronization/deployment. |

No delete, project mutation, repository mutation, cluster mutation, RBAC mutation, account/token management or rollback tool is exposed.

## Approval model

Read tools can execute automatically, subject to Argo CD RBAC and connector allowlists.

`argocd.application.sync` is a production-impacting deployment action and always requires explicit approval. The caller supplies a 64-character HMAC digest generated as:

```text
HMAC-SHA256(ARGOCD_APPROVAL_SECRET, "argocd.application.sync")
```

The approval secret remains in the connector environment. A missing or invalid approval is denied before any provider request is made.

This mechanism is a connector boundary, not a replacement for an external human-approval workflow. In production, generate approval tokens only after a trusted approval system confirms the exact intended action.

## Reliability and rate limiting

The client applies a request timeout and bounded exponential backoff to GET operations when it encounters HTTP 429, 5xx responses or transient network failures. `Retry-After` is preserved when supplied by the server.

POST deployment actions are **not retried automatically**. This prevents an ambiguous network failure from silently duplicating a high-impact deployment request.

Argo CD does not document a single universal REST request quota comparable to SaaS APIs; capacity depends on the deployed Argo CD instance and its configuration. The connector therefore avoids fan-out behavior and relies on bounded caller-driven requests. Login-specific throttling is documented by Argo CD, but this connector does not perform password login.

## Error handling

- 401/403 and other provider errors are surfaced without retry when user action/permissions are required.
- 429 and transient 5xx responses may be retried only for GET operations.
- Network requests time out according to `ARGOCD_TIMEOUT_MS`.
- Provider error bodies are capped before being placed in error messages.
- Application/project allowlist failures occur locally before network access.

## Security considerations

- Use a dedicated least-privilege Argo CD identity; never use the built-in admin account for routine automation.
- Keep `ARGOCD_TOKEN` and `ARGOCD_APPROVAL_SECRET` in a secret manager or process environment, never in prompts, examples or source control.
- Keep TLS enabled and validate the Argo CD server certificate.
- Treat manifests, repository metadata, event messages and application metadata as untrusted external content that may contain prompt-injection text.
- Connector tool names are fixed; there is no arbitrary URL/request tool and therefore no caller-controlled SSRF primitive.
- Allowlist projects/applications when the connector is used against multi-team or production Argo CD installations.
- Argo CD itself redacts stored Git credentials, cluster credentials and other secrets from API responses; the connector does not attempt to bypass that behavior.

## Example workflows

See `examples/workflows.json` for machine-readable examples. A common safe flow is:

1. `argocd.application.get`
2. `argocd.application.resource_tree`
3. `argocd.application.events`
4. `argocd.application.revision_metadata`
5. `argocd.application.sync_windows`
6. obtain explicit human approval
7. `argocd.application.sync`

For preflight checks, call `argocd.application.sync` with `dryRun: true`; approval is still required because the operation exercises deployment authorization and may carry sensitive operational intent.

## Testing

Unit tests require no live credentials:

```bash
npm test
npm run typecheck
```

Tests cover required authentication configuration, HTTPS defaults, allowlist permission denial, approval enforcement, bearer authentication isolation, provider permission errors, GET rate-limit retry and the rule that deployment POSTs are never blindly retried.

## Limitations

- REST API only; no official Argo CD MCP upstream was identified.
- No password-login/token-minting endpoint is implemented; token acquisition and rotation belong outside the agent execution path.
- No destructive operation is exposed.
- Streaming pod logs and application watches are intentionally omitted because stdio tool calls should be bounded; use observability/logging connectors for sustained streams.
- This connector relies on the Argo CD server's configured RBAC and API compatibility. Inspect that server's `/swagger-ui` when operating an older or customized Argo CD release.
