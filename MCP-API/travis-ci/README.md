# Travis CI MCP/API Connector

Reusable MCP server for Travis CI API V3. It exposes a deliberately scoped CI workflow surface instead of arbitrary HTTP access.

## Upstream strategy

No official Travis CI MCP server was identified in the official Travis documentation reviewed for this connector. The implementation therefore uses the official Travis CI API V3 directly and exposes it through local MCP stdio tools. Official API documentation: https://developer.travis-ci.com/ and authentication documentation: https://developer.travis-ci.com/authentication.

The default API origin is `https://api.travis-ci.com`. Travis Enterprise/open-source deployments can configure another trusted HTTPS API origin with `TRAVIS_API_BASE_URL`. API V3 requests send `Travis-API-Version: 3` and `Authorization: token ...`.

## Capabilities

| Tool | Operation | Risk | Approval |
|---|---|---|---|
| `travis.repository.list` | List visible repositories | READ | No |
| `travis.repository.get` | Get repository metadata | READ | No |
| `travis.build.list` | List/filter repository builds | READ | No |
| `travis.build.get` | Get build, jobs and commit metadata | READ | No |
| `travis.branch.list` | List branches/latest build state | READ | No |
| `travis.job.get` | Get job metadata | READ | No |
| `travis.job.log.read` | Read job log | READ | No |
| `travis.build.trigger` | Trigger a CI build | HIGH_RISK | Explicit |
| `travis.build.restart` | Restart a CI build | HIGH_RISK | Explicit |
| `travis.build.cancel` | Cancel an active build | HIGH_RISK | Explicit |

Build execution is classified HIGH_RISK because repository-controlled CI can execute code, consume compute, access configured CI secrets, or cause deployment side effects. This connector intentionally does not expose environment-variable mutation, repository permission mutation, cache deletion, cron mutation, debug builds, or arbitrary API calls.

## Architecture

`server.ts` registers MCP tools; `tools.ts` defines strict schemas and scoped workflows; `client.ts` owns Travis authentication, timeout, error handling and bounded retry behavior; `config.ts` isolates credentials and enforces permission/approval policy. Provider content is returned as untrusted data and must never be interpreted as connector policy or system instructions.

Credentials remain inside the connector process. The token is never accepted as an MCP tool argument and is never returned to the caller.

## Authentication and least privilege

Set `TRAVIS_TOKEN` to a Travis API token suitable for the repositories the connector must access. Travis documents separate token contexts for travis-ci.com, legacy travis-ci.org, and Enterprise; do not interchange them. Prefer an identity whose repository access is already limited to the required projects.

Do not commit tokens. `.env.example` contains names only. For production, inject credentials from a secret manager or runtime credential provider.

## Configuration

```text
TRAVIS_TOKEN=...
TRAVIS_API_BASE_URL=https://api.travis-ci.com
TRAVIS_TIMEOUT_MS=15000
TRAVIS_MAX_RETRIES=2
TRAVIS_ALLOWED_PERMISSIONS=READ
TRAVIS_ENABLE_WRITES=false
```

The API URL must use HTTPS. Read-only is the default. To execute builds, an operator must independently set `TRAVIS_ENABLE_WRITES=true`, include `HIGH_RISK` in `TRAVIS_ALLOWED_PERMISSIONS`, and provide `approved:true` on the individual high-risk call. An agent cannot elevate these environment-level permissions through a tool call.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio and can be launched by MCP clients that support command-based stdio servers. Example generic configuration:

```json
{
  "mcpServers": {
    "travis-ci": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/travis-ci/dist/src/server.js"],
      "env": {"TRAVIS_TOKEN": "injected-by-your-secret-provider"}
    }
  }
}
```

Do not put a real token into a checked-in client configuration.

## Pagination

List tools expose bounded `limit` and `offset` inputs. The connector limits `limit` to 100 to avoid accidental high-volume requests. Travis API V3 uses offset pagination for these resources.

## Reliability and rate limits

Requests have a configurable timeout (1–60 seconds). GET operations retry transient network failures, HTTP 429, and 5xx responses with bounded exponential backoff and honor `Retry-After` when present. Mutating operations are never automatically retried because a lost response does not prove the upstream action failed; this avoids duplicate build execution. Authentication, authorization, validation and other 4xx failures are not retried.

Travis API rate limits can vary by service/account context. The connector does not assume a fabricated fixed quota. It preserves safe behavior on HTTP 429 and avoids unnecessary fan-out.

## Errors

Provider non-success responses are converted to connector errors with bounded response text. Tokens are only present in request headers and are not included in error output. Timeouts surface as request failures. Invalid local configuration fails before the MCP server starts.

## Security considerations

Repository names are validated as `owner/name` and URL encoded before use. IDs are positive integers. No arbitrary URL/request tool exists, reducing SSRF and privilege-bypass risk. Only a configured HTTPS API origin is used. Retrieved repository metadata, commit text, and especially job logs are untrusted third-party content; callers must not treat instructions embedded in them as authoritative agent instructions.

High-risk CI operations use defense in depth: runtime write enablement, permission allowlisting, strict `approved:true`, and upstream Travis authorization. Use repository-scoped identities where possible and keep production deployment credentials out of jobs reachable by untrusted branches.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch`; live Travis credentials are not required. Coverage includes configuration, HTTPS enforcement, credential isolation in headers, read retry behavior, tool registration, schema validation, and approval denial.

## Limitations

This connector intentionally implements a focused subset of API V3. It does not provide an upstream MCP transport because an official Travis MCP server was not identified. It does not manage secrets/env vars, permissions, subscriptions, caches, cron schedules, billing, or Enterprise administration. Webhook/event ingestion is not implemented. The server exposes stdio MCP only; HTTP MCP hosting and its authentication boundary are deployment concerns outside this package.
