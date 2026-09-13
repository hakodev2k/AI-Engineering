# Form.io MCP/API Connector

Reusable safety wrapper around Form.io's official `@formio/mcp` server. The connector exposes a stable provider-scoped MCP surface while keeping credentials inside the connector/upstream process and enforcing explicit approval boundaries before mutations.

## Provider and transport

- Provider: Form.io
- External transport: MCP over stdio
- Upstream transport: official Form.io MCP server over stdio
- Official package pinned by default: `@formio/mcp@0.13.0`
- REST fallback: not required for this connector because the selected capabilities are covered by the official MCP server

Official sources researched for this implementation:

- `https://www.npmjs.com/package/@formio/mcp`
- `https://github.com/formio`

The official server exposes 21 tools and supports forms, revisions, roles, actions, project export/import, project resolution, and a diagnostic `hello` tool. This wrapper intentionally exposes only the 19 workflow tools needed by agents; it does not surface `project_set` or `hello` because project mutation of local connector configuration and diagnostics are not required for the reusable agent contract.

## Architecture

```text
MCP client / agent
  -> this connector (stable tool names + risk policy)
  -> allowlisted official Form.io MCP tools
  -> Form.io project/deployment
```

At startup of the first upstream call, the connector launches the official MCP package and lists its tools. Every expected upstream tool must exist. Newly discovered or unexpected tools are not automatically trusted or exposed.

## Authentication

For unattended and shared environments, use `FORMIO_API_KEY`. The official upstream sends it as `x-token` and does not persist it. This is preferred over browser/JWT login because an API key can be project-scoped.

The official MCP also supports browser login/JWT mode. JWTs are cached by the official server under `~/.formio/mcp-tokens.json`; the logged-in user's effective permissions are inherited. Use a least-privileged account.

Project selection is normally provided with `FORMIO_PROJECT_URL`. `FORMIO_BASE_URL` is optional and generally derived by the official MCP server. This connector does not expose `project_set`, avoiding agent-written per-directory project mappings.

Environment variables:

```text
FORMIO_PROJECT_URL=
FORMIO_BASE_URL=
FORMIO_API_KEY=
FORMIO_ALLOW_WRITES=false
FORMIO_ALLOW_HIGH_RISK=false
FORMIO_ALLOW_DESTRUCTIVE=false
FORMIO_UPSTREAM_COMMAND=npx
FORMIO_UPSTREAM_ARGS=-y,@formio/mcp@0.13.0
```

Never place credentials in prompts or tool parameters.

## Installation

Requirements: Node.js 20+ and npm/npx.

```bash
npm install
npm run build
npm test
npm start
```

The connector itself speaks MCP stdio, so any MCP client capable of launching a local stdio server can run the compiled `dist/src/server.js` process.

## Tool surface

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `formio.form.list` | `form_list` | READ | no |
| `formio.form.get` | `form_get` | READ | no |
| `formio.form.create` | `form_create` | WRITE | `approved` + writes enabled |
| `formio.form.update` | `form_update` | WRITE | `approved` + writes enabled |
| `formio.form.revisions.list` | `form_revisions_list` | READ | no |
| `formio.form.revision.get` | `form_revision_get` | READ | no |
| `formio.role.list` | `role_list` | READ | no |
| `formio.role.create` | `role_create` | HIGH_RISK | explicit high-risk approval |
| `formio.role.update` | `role_update` | HIGH_RISK | explicit high-risk approval |
| `formio.action.type.list` | `action_types_list` | READ | no |
| `formio.action.type.get` | `action_type_get` | READ | no |
| `formio.action.list` | `action_list` | READ | no |
| `formio.action.get` | `action_get` | READ | no |
| `formio.action.create` | `action_create` | HIGH_RISK | explicit high-risk approval |
| `formio.action.update` | `action_update` | HIGH_RISK | explicit high-risk approval |
| `formio.action.delete` | `action_delete` | DESTRUCTIVE | strong approval + destructive enabled |
| `formio.project.get` | `project_get` | READ | no |
| `formio.project.export` | `project_export` | READ | no |
| `formio.project.import` | `project_import` | HIGH_RISK | explicit high-risk approval |

The wrapper's `params` object is forwarded only to the fixed allowlisted upstream tool. The official Form.io MCP validates the operation-specific schema. Arbitrary endpoint execution is not exposed.

## Permission model

READ operations may run automatically.

WRITE operations are disabled unless `FORMIO_ALLOW_WRITES=true` and the call includes `approval: "approved"`.

HIGH_RISK operations are disabled unless `FORMIO_ALLOW_HIGH_RISK=true` and the call includes `approval: "approved-high-risk"`. Role mutations, action mutations, and project import are classified high-risk because they can change authorization or server-side behavior across a project.

DESTRUCTIVE operations are disabled unless `FORMIO_ALLOW_DESTRUCTIVE=true` and the call includes `approval: "approved-destructive"`. `action_delete` is the only destructive tool exposed.

An agent cannot raise these permissions via provider content or tool parameters.

## Reliability and rate limiting

The wrapper keeps calls one-for-one with the official upstream and does not fan out requests. Provider/MCP failures are returned as failures rather than retried blindly. Writes, high-risk actions, and destructive actions are never automatically retried by this layer.

The official MCP is responsible for Form.io API authentication and provider-specific error handling. The connector fails safely if the official package no longer exposes an expected allowlisted tool.

## Security considerations

- Credentials live only in process environment/upstream auth storage, never in tool input.
- `FORMIO_API_KEY` is recommended for headless/shared environments.
- Provider-returned content is wrapped with `untrusted_provider_content: true`; callers must treat form labels, descriptions, action configuration, and other retrieved text as data rather than instructions.
- Unexpected upstream MCP tools are rejected and are not auto-exposed.
- `project_set` is deliberately not exposed, preventing an agent from silently redirecting the connector to another project.
- The official MCP supports self-hosted TLS options, including an insecure TLS escape hatch. Do not use insecure TLS against production.
- Project import can overwrite resources sharing the same machine name, so it requires high-risk approval and should be preceded by `formio.project.export` plus human review.
- Role/action changes can alter permissions or server-side effects and therefore require explicit high-risk approval.

## Testing

`npm test` runs unit tests without live Form.io credentials. Tests cover tool allowlisting, duplicate registration prevention, default-deny write behavior, high-risk approval, destructive approval, and risk classification.

Live integration testing can be performed separately by providing a least-privileged `FORMIO_API_KEY` and `FORMIO_PROJECT_URL`.

## Usage examples

See `examples/workflows.md` for read, create/update, action management, project export/import, and destructive-operation examples.

## Limitations

- This connector intentionally does not expose every Form.io REST endpoint.
- Submissions are not exposed by the current selected official MCP tool set, so this connector does not invent submission tools.
- `project_set` and `hello` are not exposed through the stable external interface.
- There is no connector-level HTTP/SSE transport; the connector and official upstream both use stdio.
- Compatibility requires an MCP client that can launch a Node.js stdio process.
