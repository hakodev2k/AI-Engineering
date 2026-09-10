# Tiger Data MCP/API Connector

Reusable safety wrapper for Tiger Data (formerly Timescale Cloud / Timescale) built on Tiger Data's official `tiger` CLI MCP server.

## Provider and purpose

Tiger Data's official CLI includes a Model Context Protocol server for managing Tiger Cloud database services and querying PostgreSQL/TimescaleDB databases. This connector exposes a smaller, stable provider-scoped tool surface around that official MCP implementation and adds stricter approval, SQL-read validation, credential isolation, retry boundaries, and response redaction.

Official sources researched for this connector:

- Tiger CLI repository and MCP server: https://github.com/timescale/tiger-cli
- Tiger CLI MCP documentation: https://github.com/timescale/tiger-cli#readme
- Tiger Data client credentials: https://docs.timescale.com/use-timescale/latest/security/client-credentials/
- Tiger Data service management: https://docs.timescale.com/use-timescale/latest/services/service-management/
- Tiger Data service overview: https://docs.timescale.com/use-timescale/latest/services/service-overview/
- Official Terraform provider: https://registry.terraform.io/providers/timescale/timescale/latest/docs

## Transport strategy

Primary and only upstream transport for the implemented capabilities: **official Tiger CLI MCP server over stdio**.

The connector launches:

```text
tiger mcp start
```

The official MCP server currently exposes service management tools plus database schema/query tools. The connector does not depend on an unofficial MCP server and does not need a REST/API fallback for the selected capability set.

Tiger CLI also proxies documentation tools such as `search_docs` and `view_skill`. This connector intentionally does not expose those broad documentation tools because this package focuses on operational database/service workflows.

## Architecture

```text
MCP client / AI agent
        |
        v
Tiger Data connector MCP server
  - provider-scoped allowlist
  - upstream schema validation
  - permission / approval gate
  - read-only SQL classifier
  - bounded read retry
  - sensitive-field redaction
        |
        v
Official `tiger mcp start`
        |
        v
Tiger Cloud / PostgreSQL / TimescaleDB
```

Credentials remain in the connector process and Tiger CLI authentication layer. They are never accepted as MCP tool arguments and are never intentionally returned to the agent.

## Authentication

Tiger CLI supports interactive login:

```bash
tiger auth login
```

It also supports client credentials through environment variables:

```text
TIGER_PUBLIC_KEY=
TIGER_SECRET_KEY=
```

Tiger Data documents client credentials as a project-scoped public/secret key pair for programmatic access. Tiger CLI exchanges or uses those credentials internally; the connector does not implement or expose the token exchange itself.

For unattended environments, prefer dedicated client credentials with the minimum project access necessary. For local development, an already authenticated Tiger CLI session can be used instead.

`TIGER_PUBLIC_KEY` and `TIGER_SECRET_KEY` must be supplied together when environment-based client credentials are used.

## Environment variables

Copy `.env.example` into your secret-management workflow. Do not commit populated credentials.

| Variable | Default | Purpose |
| --- | --- | --- |
| `TIGER_PUBLIC_KEY` | unset | Tiger project client-credential public key |
| `TIGER_SECRET_KEY` | unset | Tiger project client-credential secret key |
| `TIGER_SERVICE_ID` | unset | Optional default service ID used by Tiger CLI |
| `TIGER_CONNECTOR_ALLOW_WRITE` | `false` | Enables connector write tools |
| `TIGER_CONNECTOR_ALLOW_HIGH_RISK` | `false` | Enables high-risk mutations |
| `TIGER_CONNECTOR_REQUIRE_WRITE_APPROVAL` | `true` | Requires exact-payload approval for WRITE tools |
| `TIGER_CONNECTOR_APPROVAL_SECRET` | unset | Operator-held HMAC secret, minimum 16 characters when required |
| `TIGER_CONNECTOR_TIMEOUT_MS` | `30000` | Per-call timeout, 1,000-120,000 ms |
| `TIGER_CONNECTOR_MAX_RETRIES` | `2` | Read-only transient retries, 0-5 |
| `TIGER_CLI_PATH` | `tiger` | Path to the installed official Tiger CLI binary |

The connector sets `TIGER_ANALYTICS=false`, `TIGER_VERSION_CHECK=false`, and `TIGER_OUTPUT=json` in the child MCP process. It sets Tiger CLI's `TIGER_READ_ONLY=true` whenever connector writes are disabled.

## Installation

Requirements:

- Node.js 20+
- npm
- Official Tiger CLI installed and available on `PATH`
- Tiger CLI authentication or Tiger client credentials

Install Tiger CLI using the official instructions, then:

```bash
npm install
npm run build
npm test
npm start
```

The connector exposes stdio MCP. Any MCP host that can launch a local stdio server can run `node dist/server.js` with the environment supplied securely by that host.

## Implemented tools

| Connector tool | Official upstream MCP tool | Risk | Approval |
| --- | --- | --- | --- |
| `tigerdata.service.list` | `service_list` | READ | No |
| `tigerdata.service.get` | `service_get` | READ | No |
| `tigerdata.service.logs` | `service_logs` | READ | No |
| `tigerdata.service.create` | `service_create` | WRITE | Configurable, required by default |
| `tigerdata.service.fork` | `service_fork` | WRITE | Configurable, required by default |
| `tigerdata.service.start` | `service_start` | HIGH_RISK | Always |
| `tigerdata.service.stop` | `service_stop` | HIGH_RISK | Always |
| `tigerdata.service.resize` | `service_resize` | HIGH_RISK | Always |
| `tigerdata.service.update_password` | `service_update_password` | HIGH_RISK | Always |
| `tigerdata.database.schema` | `db_schema` | READ | No |
| `tigerdata.database.query.read` | `db_execute_query` | READ | No |
| `tigerdata.database.query.write` | `db_execute_query` | HIGH_RISK | Always |

The official `service_delete` capability is intentionally not exposed. The connector also omits generic documentation proxy tools and does not expose any arbitrary MCP tool or raw HTTP execution surface.

## Stable tool names with current upstream schemas

Tiger CLI owns the exact provider argument schemas. To avoid copying stale schemas, this connector discovers the official Tiger MCP tool list and reuses each allowlisted tool's current JSON Schema. The local connector then:

1. maps the upstream name to a stable `tigerdata.*` name;
2. sets `additionalProperties: false`;
3. adds `approvalToken` only to locally gated tools;
4. validates every input with Ajv before forwarding;
5. fails closed if an allowlisted official tool is no longer advertised.

New upstream MCP tools are never auto-exposed.

## Permission model

`READ` operations can execute automatically.

`WRITE` operations are disabled unless:

```text
TIGER_CONNECTOR_ALLOW_WRITE=true
```

By default, enabled WRITE operations also require exact-payload human approval. An operator can set `TIGER_CONNECTOR_REQUIRE_WRITE_APPROVAL=false` only when an equivalent trusted approval boundary exists outside the connector.

`HIGH_RISK` operations require all of the following:

```text
TIGER_CONNECTOR_ALLOW_WRITE=true
TIGER_CONNECTOR_ALLOW_HIGH_RISK=true
TIGER_CONNECTOR_APPROVAL_SECRET=<operator secret>
```

and a valid exact-payload `approvalToken`.

Service stop/start/resize are high risk because they can disrupt or materially change production capacity. Password rotation is high risk because it changes database access. SQL writes are high risk because their impact depends on the supplied statement.

No tool can change these policy flags.

## Approval behavior

Approval tokens use HMAC-SHA256 over the stable external tool name plus canonical JSON of the exact arguments, excluding `approvalToken`:

```text
HMAC-SHA256(
  TIGER_CONNECTOR_APPROVAL_SECRET,
  toolName + "\n" + canonicalJson(argumentsWithoutApprovalToken)
)
```

Changing a service ID, size, SQL statement, parameter, or any other argument invalidates the approval.

Generate an approval outside model context with:

```bash
TIGER_CONNECTOR_APPROVAL_SECRET='operator-secret-at-least-16-chars' \
node examples/create-approval.mjs \
  tigerdata.service.stop \
  '{"service_id":"service-id"}'
```

The approval secret must remain in a trusted operator/UI/service layer and must not be shared with the LLM.

## Query safety

The official Tiger CLI supports `TIGER_READ_ONLY=true`. In that mode, mutating MCP tools are not registered and `db_execute_query` uses Tiger Cloud's immutable read-only connection behavior.

This wrapper adds two external query contracts:

- `tigerdata.database.query.read` accepts only SQL beginning with `SELECT`, `WITH`, `SHOW`, `EXPLAIN`, or `VALUES` and rejects common mutation/DDL keywords.
- `tigerdata.database.query.write` is HIGH_RISK, disabled by default, and always requires payload-bound human approval.

The local SQL classifier is defense in depth, not a full SQL parser. For strongest safety, operate the entire connector with `TIGER_CONNECTOR_ALLOW_WRITE=false`, which causes the official Tiger MCP child process itself to run read-only.

## Reliability

Every upstream MCP call has a bounded timeout. Only READ operations may be retried automatically, and only for transient-looking failures such as provider throttling, timeout, selected 5xx conditions, temporary unavailability, or connection resets.

Retries use bounded exponential backoff and are capped by `TIGER_CONNECTOR_MAX_RETRIES`.

Mutating operations are attempted once only. The connector never blindly retries create, fork, start, stop, resize, password rotation, or write SQL because an ambiguous transport failure could occur after the provider already committed the operation.

Tiger Cloud provider/API limits may vary by operation and account. The official Tiger MCP/CLI remains authoritative for provider-side throttling; this wrapper does not invent a numeric quota that Tiger Data does not document as universal.

## Error handling

- Invalid connector configuration fails at startup.
- Missing upstream tools fail closed.
- Invalid MCP inputs fail before provider execution.
- Permission and approval failures fail before provider execution.
- Authentication failures are surfaced without retrying writes.
- Timeout and transient failures are retried only for READ tools.
- Provider errors are returned as MCP failures without intentional credential disclosure.

## Security considerations

### Credential isolation

The agent never receives `TIGER_SECRET_KEY`, `TIGER_PUBLIC_KEY`, stored Tiger CLI session credentials, database passwords, tokens, or connection strings as tool parameters.

Provider responses are recursively redacted for sensitive field names such as password, secret, token, credential, connection string, and private key before being returned.

### Prompt injection

Service logs, schema comments, database text values, error messages, and other Tiger/PostgreSQL content are untrusted data. They are wrapped as `untrustedProviderData: true` and must never be treated as instructions that can modify connector policy, reveal credentials, or expand permissions.

### Tool restriction

Only the fixed allowlist in `src/policy.ts` is reachable. Dynamically discovered new Tiger MCP tools are ignored. `service_delete` is intentionally unavailable.

### Destructive operations

No destructive service deletion tool is registered. SQL writes remain potentially destructive and therefore use the strongest local risk class and human approval gate.

### Password rotation

`service_update_password` is included because credential rotation is operationally valuable, but it is HIGH_RISK. Any password-like value returned by the provider is redacted before agent output, so operators must use Tiger's intended secure credential retrieval/storage flow rather than asking the agent to echo secrets.

## Testing

Normal tests require no live Tiger credentials:

```bash
npm test
```

The suite covers:

- safe defaults;
- paired client-credential configuration;
- retry bounds;
- read permission behavior;
- write denial;
- high-risk feature gating;
- HMAC approval binding to the exact payload;
- approval stripping before upstream execution;
- read-only SQL acceptance;
- mutation rejection on the read-query tool.

Live provider tests are intentionally excluded because they require real Tiger Cloud access and some tools create or mutate billable infrastructure.

## Usage examples

See `examples/workflows.md` for read-only service inspection, schema discovery, read queries, service creation, service stopping, and write-query flows. See `examples/create-approval.mjs` for external approval-token generation.

## Limitations

- The official Tiger CLI binary must be installed.
- Interactive authentication is handled by `tiger auth login`; this wrapper does not implement the browser login itself.
- Client credential exchange and refresh behavior are delegated to official Tiger CLI.
- Exact upstream input schemas can evolve; the connector discovers them at runtime and fails closed when expected tools disappear.
- The connector intentionally does not expose `service_delete`, documentation proxy tools, arbitrary MCP forwarding, or raw provider HTTP requests.
- The read SQL classifier is conservative and is not a complete PostgreSQL grammar parser.
- Read-only mode is the recommended default for production-connected agents.

## Compatibility

The connector itself speaks standard MCP over stdio. It can be used by MCP hosts that support launching local stdio servers, including developer IDE/agent environments and custom MCP clients. Product-specific compatibility is not claimed for clients that cannot launch stdio subprocesses.
