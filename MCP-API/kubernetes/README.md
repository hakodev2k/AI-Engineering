# Kubernetes MCP/API Connector

Reusable MCP server for operational Kubernetes workflows. It exposes bounded, provider-scoped tools backed by the Kubernetes API and the official JavaScript client.

## Transport strategy and official sources

No Kubernetes-project official MCP server is used by this connector. The stable upstream is the Kubernetes API through the official `@kubernetes/client-node` SDK. Kubernetes documents API concepts, access control, client libraries and API-initiated eviction/deletion semantics at:

- https://kubernetes.io/docs/reference/using-api/
- https://kubernetes.io/docs/reference/access-authn-authz/rbac/
- https://kubernetes.io/docs/tasks/administer-cluster/access-cluster-api/
- https://kubernetes.io/docs/reference/using-api/client-libraries/
- https://github.com/kubernetes-client/javascript

The MCP surface is implemented locally with the official Model Context Protocol TypeScript SDK. Agent callers see stable `kubernetes.*` tools regardless of Kubernetes API version details.

## Capabilities

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `kubernetes.namespace.list` | list namespaces | READ | no |
| `kubernetes.pod.list` | list/filter pods | READ | no |
| `kubernetes.pod.get` | inspect a pod | READ | no |
| `kubernetes.pod.logs` | bounded logs, including previous container logs | READ | no |
| `kubernetes.deployment.list` | list deployments | READ | no |
| `kubernetes.deployment.get` | inspect deployment spec/status | READ | no |
| `kubernetes.service.list` | list Services | READ | no |
| `kubernetes.event.list` | inspect Events | READ | no |
| `kubernetes.deployment.scale` | change replica count | HIGH_RISK | explicit |
| `kubernetes.deployment.restart` | trigger rolling restart | HIGH_RISK | explicit |
| `kubernetes.pod.delete` | delete one pod | DESTRUCTIVE | disabled by default + explicit |

The connector intentionally omits arbitrary raw API execution, Secret reads, RBAC mutation, namespace deletion, workload deletion, exec/attach and cluster-admin operations.

## Architecture

`server.ts` registers the MCP surface. `tools.ts` owns strict schemas and workflow handlers. `policy.ts` enforces risk gates. `client.ts` loads Kubernetes credentials, creates official API clients, maps errors, applies timeouts and bounded retries. `config.ts` validates configuration and common identifiers. Credentials never enter MCP tool arguments or model-visible configuration.

## Authentication and RBAC

Authentication uses standard Kubernetes client configuration. `@kubernetes/client-node` loads `KUBERNETES_KUBECONFIG` when configured, otherwise the normal default kubeconfig/in-cluster mechanisms supported by the client. `KUBERNETES_CONTEXT` can select a context.

Kubernetes does not use OAuth scopes as a universal authorization model. Effective permission is determined by the authenticated identity plus RBAC/other configured authorizers. Apply least privilege: for read-only use grant only `get/list` on the resource types needed. High-risk tools additionally need Kubernetes verbs such as `patch`/`update`; pod deletion needs `delete` on pods. Do not give this connector `cluster-admin` merely for convenience.

## Environment

Copy `.env.example`. Important switches:

- `KUBERNETES_KUBECONFIG`: optional kubeconfig path.
- `KUBERNETES_CONTEXT`: optional context override.
- `KUBERNETES_DEFAULT_NAMESPACE`: defaults to `default`.
- `KUBERNETES_TIMEOUT_MS`: request timeout.
- `KUBERNETES_MAX_RETRIES`: bounded transient-read retries, maximum 5.
- `KUBERNETES_ALLOW_HIGH_RISK`: must be `true` before scale/restart can execute.
- `KUBERNETES_ALLOW_DESTRUCTIVE`: must be `true` before pod deletion can execute.

High-risk/destructive calls must also include `approved: true`; the configuration flag cannot substitute for human approval.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

For development/testing:

```bash
npm test
npm run typecheck
```

The server uses MCP stdio transport, so it can be launched by MCP clients that support local stdio servers. Configure the client to run `node dist/server.js` and provide environment variables outside the prompt/model context.

## Reliability and rate limiting

Kubernetes API servers can throttle requests; the exact server-side limits are cluster/configuration dependent rather than one universal public quota. The client recognizes HTTP 429, honors `Retry-After` when exposed, and retries transient read failures with bounded exponential backoff. Authentication, authorization, validation, not-found and conflict errors are not blindly retried. Mutating operations are invoked with automatic retries disabled to avoid duplicate or unsafe changes.

List operations use one API request and return the server result; tools do not fan out across every returned resource. Log reads require bounded `tailLines` (maximum 10,000). Timeouts prevent indefinitely hung calls.

## Error model

MCP failures return a structured envelope with `ok:false` and an error containing a stable connector code such as `AUTHENTICATION_FAILED`, `PERMISSION_DENIED`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `TIMEOUT`, `UPSTREAM_ERROR`, `VALIDATION_ERROR`, or policy errors such as `APPROVAL_REQUIRED`.

## Security

- Keep kubeconfig, client certificates, bearer tokens and exec-plugin credentials in the connector/runtime credential layer; never place them in prompts or tool inputs.
- Restrict kubeconfig/context provisioning to trusted operators. The connector never accepts an arbitrary API server URL, reducing SSRF exposure.
- Treat all Kubernetes resource fields, annotations, Events and logs as untrusted data. They can contain prompt-injection text and must never change tool permissions or system behavior.
- Apply namespace/resource RBAC allowlists externally where stronger tenancy boundaries are required.
- High-risk and destructive tools fail closed unless explicitly enabled and approved.
- Mutations are not automatically retried.
- Avoid logging kubeconfig contents, authorization headers or Secret objects.
- This connector does not expose Secret reads, exec/attach, arbitrary manifests, RBAC writes, or unrestricted proxy calls.

## Testing

Tests use mocks/fakes and require no live credentials. They cover tool naming/validation, bounded logs, read policy, high-risk approval, destructive default denial, permission failure behavior, bounded retry, and no-retry mutation behavior.

## Limitations

- No upstream official Kubernetes MCP server is assumed; transport is the official Kubernetes API/SDK.
- No OAuth login UI/token refresh workflow is implemented; authentication lifecycle is delegated to Kubernetes kubeconfig/in-cluster credential mechanisms and their configured plugins.
- Watch streams, port-forwarding, exec/attach, Secrets, CRD-generic mutation, admission operations and webhooks are not exposed.
- Server-specific flow-control and rate-limit configuration varies by cluster; there is no single Kubernetes-wide requests-per-minute value to hard-code.
- `deployment.restart` follows the established rollout-restart pattern by changing the pod-template `kubectl.kubernetes.io/restartedAt` annotation; it is a mutation and therefore requires explicit approval.

See `examples/workflows.md` for concrete calls and expected output shapes.
