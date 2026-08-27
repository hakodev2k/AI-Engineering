# Firebase MCP/API Connector

Reusable guarded connector for Firebase built on Google's **official Firebase MCP server** distributed by `firebase-tools`.

## Official sources researched

Checked on 2026-08-28:

- Firebase MCP server: https://firebase.google.com/docs/ai-assistance/mcp-server
- Firebase Studio MCP setup: https://firebase.google.com/docs/studio/mcp-servers
- Firebase AI assistance: https://firebase.google.com/docs/ai-assistance
- Firebase Admin SDK reference: https://firebase.google.com/docs/reference/admin/
- Firebase Admin SDK setup/authentication: https://firebase.google.com/docs/admin/setup

Firebase provides an official local stdio MCP server:

```bash
npx -y firebase-tools@latest mcp
```

Because the required capabilities are already provided by Google's trusted MCP server, this connector uses MCP rather than reimplementing those operations through REST or Admin SDK. The connector adds stable external tool names, an explicit allowlist, local risk policy, approval gates, response marking, and fail-closed validation.

## Supported capabilities

| External tool | Official upstream tool | Risk | Approval |
|---|---|---:|---|
| `firebase.project.get` | `firebase_get_project` | READ | no |
| `firebase.project.list` | `firebase_list_projects` | READ | no |
| `firebase.app.list` | `firebase_list_apps` | READ | no |
| `firebase.app.sdk_config.get` | `firebase_get_sdk_config` | READ | no |
| `firebase.firestore.document.get` | `firestore_get_document` | READ | no |
| `firebase.firestore.document.list` | `firestore_list_documents` | READ | no |
| `firebase.firestore.collection.list` | `firestore_list_collections` | READ | no |
| `firebase.firestore.document.create` | `firestore_add_document` | WRITE | yes |
| `firebase.firestore.document.update` | `firestore_update_document` | WRITE | yes |
| `firebase.firestore.document.delete` | `firestore_delete_document` | DESTRUCTIVE | yes + feature flag |
| `firebase.remote_config.template.get` | `remoteconfig_get_template` | READ | no |
| `firebase.remote_config.template.update` | `remoteconfig_update_template` | HIGH_RISK | yes |
| `firebase.storage.object.download_url.get` | `storage_get_object_download_url` | READ | no |

New tools discovered upstream are **not** exposed automatically.

## Architecture

```text
MCP client
  -> guarded Firebase connector
     -> fixed external tool map
        -> approval / destructive policy
           -> official firebase-tools MCP over stdio
              -> Firebase / Google APIs
```

At startup the connector launches the official MCP server, calls `tools/list`, selects only reviewed upstream tools, and fails safely if a required allowlisted tool is missing. The official tool input schemas are copied dynamically, so callers get current provider validation instead of stale hand-written schemas. Local `approval_token` validation is layered on top for non-read operations.

## Authentication

Authentication is delegated to the official Firebase CLI/MCP process. The documented interactive flow is:

```bash
firebase login --no-localhost
```

The connector never accepts Google access tokens, refresh tokens, passwords, service-account JSON, or API keys as MCP tool arguments. Credentials remain in the Firebase CLI / Google authentication layer.

Some upstream tools require an active Firebase project. Set the working directory with:

```text
FIREBASE_PROJECT_DIR=/path/to/firebase/project
```

That directory may contain standard Firebase CLI project configuration such as `.firebaserc` and `firebase.json`.

## Environment variables

Copy `.env.example` and configure as needed:

- `FIREBASE_PROJECT_DIR` — Firebase workspace; default current directory.
- `FIREBASE_UPSTREAM_COMMAND` — default `npx`.
- `FIREBASE_UPSTREAM_ARGS` — comma-separated args; default `-y,firebase-tools@latest,mcp`.
- `FIREBASE_TIMEOUT_MS` — per-tool timeout; default 20 seconds.
- `FIREBASE_APPROVAL_SECRET` — required for WRITE, HIGH_RISK, and DESTRUCTIVE execution.
- `FIREBASE_ENABLE_DESTRUCTIVE` — `false` by default.

## Installation

Use Node.js 22+.

```bash
npm install
npm run check
npm test
```

## Running the MCP server

```bash
npm start
```

The connector itself uses standard MCP stdio transport.

## Permission and approval model

READ tools may execute automatically.

WRITE and HIGH_RISK tools require an HMAC approval token bound to the exact external tool and exact payload:

```text
hex(HMAC-SHA256(
  FIREBASE_APPROVAL_SECRET,
  "<external-tool-name>\n<stable canonical JSON payload without approval_token>"
))
```

Changing the Firestore document, Remote Config template, or any other argument invalidates the approval.

DESTRUCTIVE tools additionally require:

```text
FIREBASE_ENABLE_DESTRUCTIVE=true
```

The agent cannot enable this through an MCP call.

## Reliability and rate limits

- Every upstream tool call has a bounded timeout.
- Provider errors are normalized into authorization, rate-limit, transient, or connector categories.
- Mutating operations are never blindly retried by this connector.
- The official Firebase MCP server and Firebase APIs remain responsible for provider-specific pagination and quota enforcement.
- Firebase quotas vary by product, so this package intentionally does not invent a single universal request-per-second limit.
- Startup fails closed if Google removes or renames a required upstream tool.

## Security considerations

- Only Google's official `firebase-tools` MCP server is used upstream.
- The connector exposes a fixed allowlist, not arbitrary upstream tools.
- Newly discovered upstream tools are not trusted automatically.
- Credentials never cross the LLM-facing tool interface.
- Firestore deletion is disabled by default.
- Remote Config publication is HIGH_RISK because it can alter live application behavior.
- Provider content is wrapped with `untrusted_provider_data: true` and must be treated as data, not instructions.
- Storage download URLs are returned as untrusted provider data.
- Login/logout, project creation, environment switching, deployments, Security Rules changes, and generic CLI execution are intentionally omitted to reduce permission-escalation and production-change risk.

## Testing

Unit tests do not require live Firebase credentials. They cover:

- fixed provider-scoped tool registration;
- read policy;
- payload-bound write approval;
- destructive-operation denial;
- high-risk Remote Config classification.

Run:

```bash
npm test
```

## Limitations

- This connector intentionally wraps a reviewed subset of the official Firebase MCP tool surface.
- Authentication remains dependent on the official Firebase CLI/MCP environment.
- It does not expose arbitrary REST requests, arbitrary CLI commands, project creation, app creation, login/logout, security-rule mutation, deployment, or environment switching.
- If Google renames an allowlisted upstream tool, startup fails safely until the mapping is reviewed.
