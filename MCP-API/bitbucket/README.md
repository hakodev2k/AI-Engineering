# Bitbucket Cloud MCP/API Connector

Reusable MCP server exposing a curated Bitbucket Cloud tool surface for repository inspection and pull-request workflows. The connector uses the official Atlassian Rovo MCP Server when configured and when the discovered tool schema can safely satisfy the operation; otherwise it falls back to the official Bitbucket Cloud REST API.

## Supported transports

- **Official Atlassian Rovo MCP Server**: preferred when `BITBUCKET_PREFER_MCP=true` and `ATLASSIAN_MCP_EMAIL` plus `ATLASSIAN_MCP_API_TOKEN` are configured. The connector connects to the official native MCP endpoint, discovers tools with `listTools`, accepts only the expected Bitbucket tool names, maps arguments only when the advertised schema supports them, and fails closed to REST when the MCP server is unavailable or the schema cannot be mapped safely.
- **Bitbucket Cloud REST API 2.0**: always available when the configured REST credential is valid. It is also the deliberate transport for branch listing and commit listing because the official Rovo MCP documentation exposes branch/commit get operations rather than list operations.

The external MCP tool contract remains stable regardless of upstream transport.

## Official sources

- Atlassian Rovo MCP supported tools: https://support.atlassian.com/atlassian-rovo-mcp-server/docs/supported-tools/
- Atlassian Rovo MCP authentication and authorization: https://support.atlassian.com/atlassian-rovo-mcp-server/docs/authentication-and-authorization/
- Bitbucket Rovo Dev advanced agentic configuration: https://support.atlassian.com/bitbucket-cloud/docs/rovo-dev-advanced-agentic-configuration/
- Bitbucket Cloud REST API: https://developer.atlassian.com/cloud/bitbucket/rest/
- Bitbucket Cloud REST API scopes: https://developer.atlassian.com/cloud/bitbucket/bitbucket-cloud-rest-api-scopes/
- Pull request REST API: https://developer.atlassian.com/cloud/bitbucket/rest/api-group-pullrequests/

## Authentication

### REST

Two modes are supported:

1. `oauth`: set `BITBUCKET_ACCESS_TOKEN`. Requests use `Authorization: Bearer ...`.
2. `api-token`: set `BITBUCKET_EMAIL` and `BITBUCKET_API_TOKEN`. Requests use HTTP Basic authentication with Atlassian email plus API token.

App passwords are intentionally not supported. Atlassian deprecated them and disabled existing Bitbucket Cloud app passwords on June 9, 2026. Use OAuth 2.0 or API tokens for new integrations.

The connector consumes an already-issued OAuth bearer token. OAuth authorization-code exchange, refresh-token storage, and token refresh should be handled by the surrounding credential provider or host platform so raw credentials never enter model prompts.

### Rovo MCP

Bitbucket tools in Atlassian Rovo MCP use API-token authentication. Set:

```text
BITBUCKET_PREFER_MCP=true
ATLASSIAN_ROVO_MCP_URL=https://mcp.atlassian.com/v1/native/mcp
ATLASSIAN_MCP_EMAIL=you@example.com
ATLASSIAN_MCP_API_TOKEN=<stored outside prompts>
```

Your Atlassian organization must permit API-token authentication for Rovo MCP and the Bitbucket workspace must be linked as required by Atlassian. If those conditions are not met, the connector safely falls back to REST.

## Least-privilege scopes

Request only the scopes needed by the enabled workflows.

### OAuth scopes

Read workflows:

- `repository`
- `pullrequest`

Pull-request writes:

- `pullrequest:write`

### API-token scopes

Read workflows:

- `read:workspace:bitbucket`
- `read:repository:bitbucket`
- `read:pullrequest:bitbucket`

Pull-request writes:

- `write:pullrequest:bitbucket`

The exact effective access is also constrained by the authenticated Atlassian identity and repository/workspace permissions.

## Environment variables

```text
BITBUCKET_AUTH_MODE=oauth
BITBUCKET_ACCESS_TOKEN=
BITBUCKET_EMAIL=
BITBUCKET_API_TOKEN=
BITBUCKET_ALLOWED_WORKSPACES=
BITBUCKET_ALLOWED_REPOSITORIES=
BITBUCKET_APPROVAL_SECRET=
BITBUCKET_TIMEOUT_MS=15000
BITBUCKET_MAX_RETRIES=3
BITBUCKET_PREFER_MCP=true
ATLASSIAN_ROVO_MCP_URL=https://mcp.atlassian.com/v1/native/mcp
ATLASSIAN_MCP_EMAIL=
ATLASSIAN_MCP_API_TOKEN=
```

`BITBUCKET_ALLOWED_WORKSPACES` and `BITBUCKET_ALLOWED_REPOSITORIES` are comma-separated allowlists. Repository entries can be a repository slug or `workspace/repository`. Empty allowlists mean the authenticated identity's provider-level access is not further narrowed by connector configuration.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
```

Run the stdio MCP server:

```bash
npm start
```

Development checks:

```bash
npm run typecheck
npm test
```

## MCP client configuration

Any MCP client capable of launching a stdio server can invoke this package. Example conceptual configuration:

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/bitbucket/dist/src/server.js"],
      "env": {
        "BITBUCKET_AUTH_MODE": "oauth",
        "BITBUCKET_ACCESS_TOKEN": "provided-by-secure-runtime"
      }
    }
  }
}
```

Credential values should come from the client's secret store or process environment, not from an LLM prompt. The connector works with Claude Code, Cursor, custom MCP clients, and other clients that can launch a standard stdio MCP server. ChatGPT-compatible use requires an environment or bridge that can connect to this stdio MCP server; no broader compatibility is claimed.

## Architecture

```text
MCP client / agent
       |
       v
Bitbucket connector MCP server
       |
       +--> policy + approval + target allowlists
       |
       +--> official Atlassian Rovo MCP (preferred when configured)
       |        |
       |        +--> schema discovery and validation
       |        +--> exact Bitbucket tool allowlist
       |        +--> failure/schema mismatch -> REST fallback
       |
       +--> official Bitbucket Cloud REST API 2.0
                |
                +--> bounded retry / timeout / rate-limit handling
```

Credentials stay in the connector process. Provider data returned by Bitbucket or Rovo MCP is treated as untrusted data and is never interpreted as permission-changing instructions.

## Tools

| Tool | Purpose | Risk | Approval | Upstream |
| --- | --- | --- | --- | --- |
| `bitbucket.repository.list` | List repositories in a workspace | READ | No | Rovo MCP -> REST |
| `bitbucket.repository.get` | Read repository metadata | READ | No | Rovo MCP -> REST |
| `bitbucket.branch.list` | List repository branches | READ | No | REST |
| `bitbucket.commit.list` | List commits, optionally from a revision | READ | No | REST |
| `bitbucket.source.read` | Read one text file at a revision, capped at 200 KiB | READ | No | Rovo MCP -> REST |
| `bitbucket.pull_request.list` | List pull requests | READ | No | Rovo MCP -> REST |
| `bitbucket.pull_request.get` | Read one pull request | READ | No | Rovo MCP -> REST |
| `bitbucket.pull_request.create` | Create a pull request | WRITE | Yes | Rovo MCP -> REST |
| `bitbucket.pull_request.comment` | Post a pull-request comment | WRITE | Yes | Rovo MCP -> REST |
| `bitbucket.pull_request.approve` | Approve a pull request | WRITE | Yes | Rovo MCP -> REST |
| `bitbucket.pull_request.merge` | Merge a pull request | HIGH_RISK | Yes | Rovo MCP -> REST |

There are no unrestricted arbitrary HTTP/API tools and no repository-delete tool.

## Approval model

All writes require explicit approval. Merge is classified `HIGH_RISK` and also requires explicit approval.

The approval value is a 64-character lowercase hexadecimal HMAC-SHA256 digest over the exact MCP tool name using `BITBUCKET_APPROVAL_SECRET` as the key. For example, the controller approving `bitbucket.pull_request.create` computes:

```text
HMAC-SHA256(secret, "bitbucket.pull_request.create")
```

The human-facing controller or trusted orchestration layer computes the digest and supplies it as `approvalId`. The model should not receive `BITBUCKET_APPROVAL_SECRET`, so it cannot silently manufacture its own approval token. Approval is tool-scoped: a create approval does not authorize merge.

## Validation and safety boundaries

- Workspace and repository slugs have bounded, conservative schemas.
- Optional page sizes are bounded to 1-100.
- Source paths reject `..` path traversal.
- Source reads are capped at 200 KiB before returning content to the agent.
- REST calls use a fixed `https://api.bitbucket.org/2.0` base URL, preventing arbitrary-host SSRF through tool parameters.
- Rovo MCP uses the configured official endpoint and exact expected Bitbucket tool names rather than automatically trusting newly discovered tools.
- MCP argument mapping is performed against the upstream advertised input schema; missing required mappings cause REST fallback rather than guessed calls.
- Target allowlists can restrict workspaces and repositories independently of provider scopes.
- Credentials are only placed in transport authorization headers and are never returned by MCP tools.
- Retrieved repository content, comments, pull requests, and MCP responses are untrusted data, not instructions.

## Reliability and rate limits

The REST transport provides:

- request timeout with `AbortController`;
- bounded retries configured by `BITBUCKET_MAX_RETRIES` from 0 to 5;
- exponential backoff capped at 8 seconds;
- handling of HTTP `429` and server-side `5xx` responses;
- `Retry-After` preservation when provided by Bitbucket;
- no automatic retry of ordinary authentication, authorization, validation, or other non-retryable 4xx failures;
- caller-controlled pagination using `pagelen`, capped at 100.

Atlassian can apply different quotas depending on authentication and account context, so this connector does not invent a fixed numeric rate limit. It responds to the provider's actual throttling signals.

The Rovo transport fails closed. If it cannot connect, its expected tool is absent, a required schema field cannot be mapped, or a call fails, the connector uses the corresponding official REST operation when one is implemented.

## Error handling

REST failures are surfaced with the HTTP status and a bounded provider error body. Secrets are not included in URLs or errors. Timeouts are reported separately. Permission and authentication failures require operator action and are not blindly retried.

MCP failures are not used to expand permissions or discover arbitrary replacement tools. The connector only attempts the documented Bitbucket Rovo tool families embedded in the implementation.

## Usage examples

See `examples/workflows.json` for executable-shaped examples including input, expected output shape, permission class, and approval requirement.

Representative flow:

```text
bitbucket.repository.get
  -> bitbucket.branch.list
  -> bitbucket.source.read
  -> bitbucket.pull_request.list
  -> bitbucket.pull_request.get
  -> human approval
  -> bitbucket.pull_request.comment / create
  -> human approval
  -> bitbucket.pull_request.merge
```

## Testing

Tests use mocks and do not require live Bitbucket or Rovo credentials. Covered behavior includes:

- authentication configuration validation;
- workspace/repository allowlists;
- approval denial and accepted tool-scoped approval;
- credentials remaining in authorization headers rather than request URLs;
- throttling retry behavior;
- no retry on permission errors;
- MCP not configured/fails-closed behavior enabling REST fallback.

Run:

```bash
npm run typecheck
npm test
```

## Limitations

- Rovo MCP Bitbucket availability depends on Atlassian organization policy, API-token authorization, and workspace linkage.
- The connector does not implement OAuth browser flows or refresh-token persistence; supply a current bearer token from a credential provider.
- Rovo tool schemas can evolve. The connector intentionally fails closed and falls back to REST when required fields cannot be mapped.
- Branch listing and commit listing currently use REST because the official Rovo MCP tool documentation exposes corresponding get operations rather than list operations.
- Only the curated 11 operations documented above are exposed; many Bitbucket endpoints are intentionally omitted.
- Repository deletion, permission administration, billing operations, pipeline execution, and other destructive or broader administrative actions are not exposed.
- `bitbucket.source.read` is intended for bounded text content, not arbitrary large binaries.
