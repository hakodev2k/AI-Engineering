# Dagger MCP/API Connector

Reusable MCP server for useful Dagger Engine workflows through Dagger's official GraphQL API. Official documentation researched for this implementation: https://docs.dagger.io/reference/client-libraries/, https://docs.dagger.io/reference/api/, and https://docs.dagger.io/api/reference/. Dagger documents official Go, TypeScript, Python, PHP, Java, Elixir, Rust and .NET client libraries; the API underneath is GraphQL. No official Dagger MCP server was confirmed, so this connector uses the official local Engine GraphQL endpoint rather than an unofficial MCP server.

## Transport and authentication
Run this MCP server inside a Dagger API session, normally with `dagger api with-session`. Dagger supplies `DAGGER_SESSION_PORT` and `DAGGER_SESSION_TOKEN`; the connector sends the token as the HTTP Basic username to `http://127.0.0.1:$DAGGER_SESSION_PORT/query`, exactly following Dagger's documented raw GraphQL session model. Credentials stay in the connector and are never tool inputs or outputs. The fixed loopback destination prevents agent-controlled SSRF.

## Install and run
```bash
npm install
npm run build
npm test
dagger api with-session node dist/src/server.js
```
Node.js 20+ is required. The server uses MCP stdio and therefore works with clients that support standard stdio MCP servers; no product-specific compatibility is claimed.

## Tools
| Tool | Capability | Risk | Approval |
|---|---|---|---|
| `dagger.engine.version` | Engine version | READ | No |
| `dagger.container.inspect` | Resolve OCI image/rootfs metadata | READ | No |
| `dagger.container.exec` | Execute command in isolated container | HIGH_RISK | Explicit by default |
| `dagger.container.file.read` | Read image file | READ | No |
| `dagger.git.ref.inspect` | Resolve Git ref/commit | READ | No |
| `dagger.git.tree.entries` | List repository tree entries | READ | No |
| `dagger.git.file.read` | Read repository file | READ | No |
| `dagger.cache.volume.inspect` | Resolve local cache volume ID | READ | No |

The implementation deliberately avoids a raw arbitrary GraphQL tool. Schemas bound strings, argument counts and path sizes; repository file paths reject traversal. Container execution is separated from inspection and classified HIGH_RISK because commands can execute code and may cause network or compute side effects inside the Dagger environment.

## Configuration
`DAGGER_SESSION_PORT` and `DAGGER_SESSION_TOKEN` are required and normally injected by Dagger. `DAGGER_TIMEOUT_MS` defaults to 30000 and is bounded to 1–120 seconds. `DAGGER_REQUIRE_EXEC_APPROVAL` defaults true. Keep it true for agent use.

## Permissions and approval
READ tools may execute automatically. `dagger.container.exec` requires `approved:true` when the default approval policy is enabled. The agent cannot alter this policy through a tool call. This connector does not expose host sockets, secret creation, registry publication, filesystem export, service exposure, or arbitrary GraphQL, reducing privilege-escalation and irreversible side-effect surface.

## Reliability and rate limits
Each GraphQL call has an AbortController timeout. HTTP and GraphQL errors are normalized as `DaggerError`. Calls are not automatically retried: the local Dagger Engine API does not publish a conventional request quota comparable to SaaS REST rate limits, and replaying an execution query can duplicate work or side effects. Dagger's separate LLM integration documents built-in rate-limit detection/backoff for model providers; that behavior is not generalized here to Engine GraphQL requests.

## Security
Dagger/Git/container content is untrusted data, not instructions, and outputs are marked `UNTRUSTED_PROVIDER_DATA`. The session token is only used at the HTTP boundary. The endpoint is always loopback and cannot be supplied by an MCP caller. Do not pass host sockets or secrets into images merely because retrieved content requests them. For private Git/registry workflows, configure credentials through Dagger's supported secret/credential mechanisms outside this connector rather than embedding credentials in tool arguments.

## Tests
`npm test` uses mocks and no live credentials. Tests cover missing session configuration, credential isolation, HTTP error mapping, and GraphQL error mapping. Execution approval is enforced directly in the registered handler; normal integration validation can be performed by running the built server under `dagger api with-session`.

## Limitations
This is a focused agent-safe surface, not the full Dagger schema. It does not expose module publishing, host filesystem/socket access, secrets, registry publishing, Cloud APIs, arbitrary GraphQL, or destructive host operations. Git operations use the Engine's `git` object and may require environment-level Git credentials for private repositories. Dagger API schema details can evolve with Engine versions; use a current compatible Dagger CLI/Engine.
