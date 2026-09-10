# Healthchecks.io MCP/API Connector

Reusable MCP server for Healthchecks.io cron-job and heartbeat monitoring workflows. It exposes stable provider-scoped MCP tools backed by the official Healthchecks.io Management API v3.

## Transport strategy

Research of current official Healthchecks.io documentation found the official Management API v3 and Pinging API, but no official Healthchecks.io MCP server. This connector therefore uses the official REST Management API v3 directly and exposes its selected capabilities through MCP over stdio.

Official sources:

- https://healthchecks.io/docs/api/
- https://healthchecks.io/docs/http_api/
- https://healthchecks.io/docs/badges/
- https://healthchecks.io/docs/slug_urls/

## Supported capabilities

| Tool | Transport | Risk | Approval | Required provider permission |
|---|---|---|---|---|
| `healthchecks.check.list` | REST | READ | No | read-only or read-write project API key |
| `healthchecks.check.get` | REST | READ | No | read-only or read-write project API key |
| `healthchecks.check.create` | REST | WRITE | Configurable; required by default | read-write project API key |
| `healthchecks.check.update` | REST | WRITE | Configurable; required by default | read-write project API key |
| `healthchecks.check.pause` | REST | WRITE | Configurable; required by default | read-write project API key |
| `healthchecks.check.resume` | REST | WRITE | Configurable; required by default | read-write project API key |
| `healthchecks.check.delete` | REST | DESTRUCTIVE | Always required | read-write project API key |
| `healthchecks.check.flips.list` | REST | READ | No | read-only or read-write project API key |
| `healthchecks.integration.list` | REST | READ | No | provider may require a read-write key for channels |
| `healthchecks.badge.list` | REST | READ | No | read-only or read-write project API key |
| `healthchecks.service.status` | REST | READ | No | configured project API key |

The Pinging API is intentionally not exposed as an unrestricted agent tool. Ping URLs and project ping keys are operational secrets, and indiscriminate pinging can corrupt monitoring state. Applications that emit job telemetry should use the official Pinging API directly from the monitored workload.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict Zod tool schema
  -> approval/risk policy
  -> HealthchecksClient
  -> HTTPS Management API v3
```

Credentials are loaded only inside the connector process and are never returned through tools.

## Authentication

Healthchecks.io Management API keys are project-specific and sent in the `X-Api-Key` header.

Use a read-only API key when only read tools are needed. Use a read-write key only when create/update/pause/resume/delete or channels access is required. Healthchecks.io does not provide account-wide API keys for this API.

Environment variables:

```text
HEALTHCHECKS_API_KEY=
HEALTHCHECKS_API_BASE=https://healthchecks.io/api/v3
HEALTHCHECKS_TIMEOUT_MS=10000
HEALTHCHECKS_MAX_RETRIES=3
HEALTHCHECKS_APPROVAL_MODE=write
```

`HEALTHCHECKS_APPROVAL_MODE` values:

- `none`: WRITE tools run without connector-level approval; DESTRUCTIVE still requires approval.
- `write`: WRITE and DESTRUCTIVE require approval. This is the default.
- `all`: all non-read mutations require approval; DESTRUCTIVE remains mandatory.

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
```

## Running

```bash
export HEALTHCHECKS_API_KEY="..."
npm start
```

The process exposes a standard stdio MCP server and can be configured in MCP clients that support stdio child processes.

## Tool behavior and validation

Tool schemas are intentionally narrow. Check identifiers allow only alphanumeric characters, underscores, and hyphens. Custom slugs are constrained to lowercase ASCII letters, digits, underscores, and hyphens, matching Healthchecks.io slug rules. Timeouts and grace periods are bounded to prevent accidental extreme values. No tool accepts arbitrary URLs or arbitrary HTTP methods.

Provider content is treated as untrusted data. Returned descriptions, tags, status values, and integration metadata are serialized as data and never interpreted as connector instructions.

## Approval and safety model

READ tools may run automatically. WRITE operations are approval-gated by default. `healthchecks.check.delete` is DESTRUCTIVE and always requires explicit approval. Destructive HTTP DELETE requests are not automatically retried.

Callers pass `approved: true` only after the human has reviewed the exact action and arguments. The connector strips approval metadata before sending provider requests.

The connector never escalates API-key permissions. If a read-only key is used for a write operation, the provider rejection is returned as an error.

## Reliability

The REST client applies:

- AbortController-based request timeouts.
- Bounded retries for HTTP 429 and 5xx responses.
- Exponential backoff when `Retry-After` is unavailable.
- `Retry-After` preservation on provider errors.
- No retries for authentication, permission, validation, or other 4xx failures.
- No automatic retries for DELETE operations.
- Conventional provider error mapping through `HealthchecksError`.

Healthchecks.io documentation asks clients to avoid more than 100 Management API requests per minute. The Pinging API should not ping an individual check more than five times per minute. This connector only uses the Management API and avoids hidden fan-out; one MCP tool call maps to one provider request.

## Error handling

Provider failures are returned as structured MCP error content containing `error`, HTTP `status`, provider `message`, and `retryAfter` when present. Local validation and approval failures are returned as connector errors without exposing the API key.

## Examples

See `examples/workflows.md` for read, create, history, pause, and delete workflows with permissions and approval expectations.

## Testing

Unit tests use mocked `fetch` implementations and no live credentials.

```bash
npm test
```

Tests cover configuration validation, tool registration, input validation, approval enforcement, approved writes, non-retryable authentication errors, 429 retry behavior, and no-retry behavior for destructive DELETE requests.

## Security considerations

- API keys remain in process environment/configuration and are never included in tool output.
- Use the least-privileged Healthchecks.io project API key that supports the enabled workflows.
- Do not place API keys or ping keys in prompts, examples, logs, or source control.
- The API base is configuration-controlled rather than tool-controlled, preventing agent-supplied SSRF targets.
- No arbitrary HTTP request tool is exposed.
- Retrieved provider content is untrusted data.
- Human approval is mandatory for deletion and enabled by default for other mutations.

## Limitations

- This connector targets official Management API v3 only.
- It does not expose the Pinging API, auto-provisioning through ping URLs, or raw ping keys.
- Healthchecks.io read-only keys intentionally cannot access every Management API endpoint; the provider's permission model remains authoritative.
- API behavior and limits can vary by account plan; provider responses are authoritative.
- No official Healthchecks.io MCP server was found in the official documentation reviewed for this implementation, so all implemented provider operations use REST.
