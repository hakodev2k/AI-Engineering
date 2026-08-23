# Replicate MCP Connector

Reusable MCP server exposing a focused, safety-oriented subset of the official Replicate HTTP API for AI agents and MCP clients.

## Provider and transport

Provider: Replicate.

Upstream transport: official Replicate HTTP API at `https://api.replicate.com/v1`.

Official MCP status checked on 2026-08-24: Replicate's official documentation exposes HTTP API and client libraries, but no official Replicate MCP server is documented. This connector therefore uses the official HTTP API directly while exposing a stable MCP interface.

Official references:

- HTTP API: `https://replicate.com/docs/reference/http`
- API tokens: `https://replicate.com/docs/topics/security/api-tokens/`
- Prediction lifecycle: `https://replicate.com/docs/topics/predictions/`
- Create prediction: `https://replicate.com/docs/topics/predictions/create-a-prediction/`
- Rate limits: `https://replicate.com/docs/topics/predictions/rate-limits`
- Webhooks: `https://replicate.com/docs/topics/webhooks/`

## Capabilities

The server implements these MCP tools:

| Tool | Purpose | Risk | Approval |
|---|---|---:|---:|
| `replicate.model.search` | Search public catalog content | READ | No |
| `replicate.model.get` | Read model metadata | READ | No |
| `replicate.model.version.list` | List model versions | READ | No |
| `replicate.prediction.list` | List account predictions | READ | No |
| `replicate.prediction.get` | Read one prediction | READ | No |
| `replicate.prediction.create` | Run an explicit model version | WRITE | Yes |
| `replicate.model.prediction.create` | Run a named official model | WRITE | Yes |
| `replicate.prediction.cancel` | Cancel a running prediction | WRITE | Yes |
| `replicate.deployment.list` | List deployments | READ | No |
| `replicate.deployment.get` | Read deployment metadata | READ | No |
| `replicate.deployment.prediction.create` | Run a deployment | WRITE | Yes |
| `replicate.training.list` | List trainings | READ | No |
| `replicate.training.get` | Read one training | READ | No |
| `replicate.training.cancel` | Cancel a running training | WRITE | Yes |

The connector deliberately does not expose a generic arbitrary HTTP request tool, model/deployment deletion, model mutation, deployment mutation, or training creation. Those operations can have broader cost, lifecycle, or destructive impact and are outside this connector's current scoped interface.

## Architecture

```text
MCP client
  -> stdio MCP server (`src/server.ts`)
  -> validation / allowlists / approval policy
  -> Replicate REST client (`src/client.ts`)
  -> Bearer token credential boundary
  -> api.replicate.com
```

Provider responses are returned as data. Retrieved model output, logs, README content, or prediction output must be treated by callers as untrusted third-party content, never as instructions that can alter system policy or permissions.

## Authentication

Replicate requires an API token in the HTTP `Authorization` header as `Bearer <token>`.

Set:

```bash
REPLICATE_API_TOKEN=r8_...
```

The token is read only inside the connector process and is never returned in MCP results. Do not place the token in prompts, examples, committed configuration, or logs.

Use separate tokens for environments where practical and disable exposed tokens immediately from Replicate's token management UI.

## Environment variables

```text
REPLICATE_API_TOKEN=                 # required
REPLICATE_APPROVAL_SECRET=           # required for write tools
REPLICATE_ALLOWED_OWNERS=            # optional CSV, e.g. black-forest-labs,acme
REPLICATE_ALLOWED_MODELS=            # optional CSV of owner/model
REPLICATE_ALLOWED_DEPLOYMENTS=       # optional CSV of owner/deployment
REPLICATE_TIMEOUT_MS=30000            # 1000..120000
REPLICATE_MAX_RETRIES=3               # 0..5
```

Empty allowlists mean no connector-side restriction for that category. Production deployments should normally configure allowlists.

## Approval model

READ tools may execute without an approval token.

Every WRITE tool requires `REPLICATE_APPROVAL_SECRET` and an `approvalId`. The approval value is an HMAC-SHA256 digest of the exact MCP tool name using the configured approval secret. This creates a separate approval boundary for each write capability.

Example generator in Node.js:

```js
import crypto from 'node:crypto';
const approvalId = crypto
  .createHmac('sha256', process.env.REPLICATE_APPROVAL_SECRET)
  .update('replicate.model.prediction.create')
  .digest('hex');
```

Approval does not grant additional provider permissions; Replicate still authorizes every request using the API token associated with the connector.

## Installation

Requirements: Node.js 20 or newer.

```bash
cd MCP-API/replicate
npm install
npm run build
```

## Running

```bash
REPLICATE_API_TOKEN=... \
REPLICATE_APPROVAL_SECRET=... \
npm start
```

The server uses MCP over stdio and can be launched by MCP clients that support local stdio servers, including compatible ChatGPT/agent bridges, Claude/Claude Code, Cursor, and custom MCP clients. Compatibility depends on the client supporting standard stdio MCP server configuration.

## Example MCP client configuration

```json
{
  "mcpServers": {
    "replicate": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/replicate/dist/server.js"],
      "env": {
        "REPLICATE_API_TOKEN": "${REPLICATE_API_TOKEN}",
        "REPLICATE_APPROVAL_SECRET": "${REPLICATE_APPROVAL_SECRET}",
        "REPLICATE_ALLOWED_MODELS": "black-forest-labs/flux-schnell"
      }
    }
  }
}
```

Do not replace environment interpolation with a real committed secret.

## Prediction behavior

Replicate supports asynchronous predictions by default. The create tools optionally accept `waitSeconds` from 1 through 60, which maps to Replicate's `Prefer: wait=n` behavior. If the model has not completed within that period, the returned prediction can remain in `starting` or `processing` state and should be read later with `replicate.prediction.get`.

The optional `cancelAfter` field maps to Replicate's `Cancel-After` header and can constrain prediction lifetime. The connector does not accept webhook URLs. This intentionally avoids turning an agent-controlled URL into an SSRF or exfiltration primitive. Applications that require webhooks should configure and validate webhook destinations outside this generic connector boundary.

## Reliability and rate limits

As documented by Replicate at the time of implementation:

- prediction creation: 600 requests per minute
- other endpoints: 3000 requests per minute
- throttling returns HTTP 429

The client preserves `Retry-After` when present and uses bounded exponential backoff for retryable GET operations. It does not automatically retry POST operations, because prediction creation, cancellation, and other writes must not be duplicated blindly.

Network timeouts are bounded by `REPLICATE_TIMEOUT_MS`. Provider errors are mapped to `ReplicateError` with the HTTP status and a bounded provider error body. Credentials are not included in error messages.

## Pagination

Replicate list endpoints return provider-native pagination fields such as `next`, `previous`, and `results`. This connector returns those values unchanged rather than automatically traversing every page, preventing unbounded calls and accidental large context expansion.

## Security considerations

- API tokens remain inside the connector credential layer.
- Model and deployment identifiers are validated and URL encoded.
- Optional owner/model/deployment allowlists reduce accidental cross-project access.
- All cost-incurring or state-changing tools require explicit approval.
- POST requests are not automatically retried.
- No unrestricted HTTP endpoint tool exists.
- No user-controlled webhook URL is exposed.
- Provider outputs are untrusted data and must not modify agent permissions or system instructions.
- The connector does not log request authorization headers.

Replicate notes that API prediction input/output data and generated files can have limited retention. Persist required outputs in an application-controlled store when appropriate and follow Replicate's current retention documentation.

## Tests

Unit tests require no live Replicate credentials.

```bash
npm test
npm run typecheck
```

Tests cover configuration validation, allowlists, approval behavior, Bearer authentication, provider error mapping, rate-limit retry behavior for GETs, and the no-blind-retry rule for POST writes.

## Examples

See `examples/workflows.json` for reusable discovery, prediction, status, and deployment workflows. Example approval values are placeholders only.

## Limitations

- No official Replicate MCP server was documented when this connector was created, so all upstream calls use the official HTTP API.
- Search is a Replicate beta endpoint and may evolve.
- This connector intentionally omits destructive model/deployment operations and training creation.
- It returns provider-native prediction output shapes because schemas differ by model.
- Streaming/SSE output is not proxied through this stdio tool surface; poll with `replicate.prediction.get` or build a dedicated streaming integration if required.
- Webhook receiver hosting and signature verification are application concerns and are not implemented here.
