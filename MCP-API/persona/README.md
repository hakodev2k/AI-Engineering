# Persona MCP Connector

Reusable MCP connector for Persona identity-verification data and workflows. The connector exposes a deliberately small, stable, provider-scoped tool surface and routes those tools to Persona's official remote MCP server.

## Transport strategy

Persona provides an official remote MCP server at `https://mcp.withpersona.com`. Persona documents that the server exposes more than 190 API actions across major resource groups, uses the same API keys and permissions as the Persona API, is stateless, and shares the same API rate limits and error model. Because the required capabilities in this package are supported by that official MCP server, this connector uses MCP directly and does not add an unnecessary REST fallback.

Official sources:

- Persona MCP Server: https://help.withpersona.com/articles/3Ev9FHB3kXENDUwbGg20KX/
- API reference: https://docs.withpersona.com/api-reference
- API keys and permissions: https://docs.withpersona.com/api-keys
- Inquiries: https://docs.withpersona.com/api-reference/inquiries
- Webhooks: https://docs.withpersona.com/webhooks

The Persona MCP documentation was last updated September 1, 2026. The connector pins the Persona API version header to `2025-12-08` by default because Persona recommends pinning a dated version for consistent behavior.

## Supported capabilities

| Tool | Upstream | Risk | Persona permission | Approval |
|---|---|---|---|---|
| `persona.inquiry.list` | official MCP | READ | `inquiry.read` | none |
| `persona.inquiry.get` | official MCP | READ | `inquiry.read` | none |
| `persona.inquiry.search` | official MCP | READ | `inquiry.read` | none |
| `persona.inquiry.create` | official MCP | WRITE | `inquiry.write` | explicit |
| `persona.account.list` | official MCP | READ | `account.read` | none |
| `persona.account.get` | official MCP | READ | `account.read` | none |
| `persona.case.list` | official MCP | READ | `case.read` | none |
| `persona.case.get` | official MCP | READ | `case.read` | none |
| `persona.verification.get` | official MCP | READ | `verification.read` | none |
| `persona.report.get` | official MCP | READ | `report.read` | none |
| `persona.transaction.get` | official MCP | READ | `transaction.read` | none |
| `persona.webhook.list` | official MCP | READ | `webhook.read` | none |

No delete, API-key management, permission management, approval/decline decision, or other irreversible/high-impact Persona action is exposed.

## Architecture

```text
MCP client
  -> local Persona connector (stdio)
     -> fixed stable tool allowlist
        -> risk / approval policy
           -> live upstream schema validation
              -> official Persona MCP server
                 -> Persona API
```

The model never receives `PERSONA_API_KEY`. The credential is loaded from process environment inside the connector and is forwarded only to the hard-pinned official Persona MCP hostname. Configuration rejects a non-Persona MCP host to reduce credential-exfiltration and SSRF risk.

The upstream MCP server exposes many more tools than this package. They are not automatically re-exported. During connection, the package resolves only its fixed operation set, compiles Persona's live JSON input schemas with AJV, and validates every call before forwarding it. If an upstream tool cannot be resolved unambiguously, startup/call fails safely rather than selecting a newly discovered tool automatically.

## Authentication and least privilege

Create a dedicated Persona API key for the agent. Persona API keys support per-resource read/write permissions. Grant only the permissions required by the tools you intend to use.

For a read-only investigation assistant, a typical subset is:

```text
inquiry.read
account.read
case.read
verification.read
report.read
transaction.read
webhook.read
```

Only add `inquiry.write` if inquiry creation is required. The local write gate remains disabled unless `PERSONA_ALLOW_WRITES=true` is deliberately configured.

Persona authenticates the official MCP endpoint with the same API key used by its API, sent as `Authorization: Bearer <key>`.

## Environment

Copy `.env.example` into your secret-management workflow. Do not commit a populated `.env` file.

```text
PERSONA_API_KEY=
PERSONA_MCP_URL=https://mcp.withpersona.com
PERSONA_VERSION=2025-12-08
PERSONA_TIMEOUT_MS=15000
PERSONA_MAX_RETRIES=3
PERSONA_ALLOW_WRITES=false
PERSONA_ALLOW_HIGH_RISK=false
```

`PERSONA_MCP_URL` is intentionally restricted to the official `mcp.withpersona.com` HTTPS hostname.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
```

## Run the MCP server

```bash
PERSONA_API_KEY=... npm start
```

The package exposes a standard stdio MCP server suitable for MCP clients capable of launching local stdio servers, including compatible custom agents and desktop/coding clients. Client-specific configuration syntax varies by product.

## Tool input validation

Every exported tool accepts:

```json
{
  "params": {},
  "approval": "approved"
}
```

`params` is not an arbitrary HTTP request surface. It is sent only to the fixed corresponding Persona MCP operation and is validated against that operation's live official MCP JSON schema before execution. Unknown or invalid provider arguments fail locally. `approval` is ignored for reads and required for enabled writes.

This design avoids hard-coding a stale copy of Persona's large evolving OpenAPI schema while preserving a narrow external action allowlist.

## Permission and approval model

- `READ`: executes automatically if the Persona key has the corresponding read permission.
- `WRITE`: disabled by default; requires `PERSONA_ALLOW_WRITES=true` and `approval: "approved"` (or stronger).
- `HIGH_RISK`: infrastructure support exists in the policy layer, but no high-risk Persona tool is currently exported. It requires a separate enable flag plus `approved-high-risk`.
- `DESTRUCTIVE`: always denied by this connector.

The agent cannot elevate its Persona API-key permissions. Persona itself enforces the key's scopes upstream as an additional authorization boundary.

## Reliability and rate limits

Persona documents that its MCP server uses the same rate limits as the external API. Authenticated API responses expose rate-limit information, and rate limiting returns HTTP 429. This connector performs bounded exponential-backoff retries only for transient conditions such as 429, timeouts, and 502/503/504 errors.

Defaults:

- timeout: 15 seconds per tool call
- retries: 3 after the initial attempt
- maximum configurable retries: 5
- backoff: exponential, capped at 3 seconds between attempts

Authentication, permission, schema-validation, ambiguous-tool-resolution, and other non-transient failures are not blindly retried.

## Errors

Expected failure classes include:

- missing/invalid `PERSONA_API_KEY`
- Persona 401 authentication errors
- Persona 403 permission errors
- Persona 429 throttling
- invalid tool arguments rejected by the live MCP schema
- an upstream tool renamed/removed in a way that cannot be safely resolved
- timeout/network/transient upstream failures

Persona's request IDs and provider errors remain in the upstream result/error path for debugging. Do not log API keys or full sensitive identity payloads in application logs.

## Security considerations

Persona data can contain highly sensitive identity, verification, fraud, and case-review information. Apply data-minimization and retention controls outside this connector as well.

Key defenses in this package:

- credentials isolated in connector process environment
- official MCP hostname pinning
- no generic URL/request execution tool
- fixed external tool allowlist
- upstream MCP tool discovery is not automatically trusted
- live schema validation before every provider call
- read-only default posture
- write operation disabled by default and human-approved when enabled
- destructive actions unavailable
- provider output explicitly marked `untrusted_provider_content: true`
- very large provider strings truncated before returning them to the MCP caller

Treat names, notes, fields, report content, and any other Persona-returned text as data, never as instructions that can alter agent policy or permissions.

## Webhooks

Persona supports webhooks and a Webhooks API. This connector intentionally exposes only `persona.webhook.list`; it does not create or modify webhook destinations because endpoint changes can redirect sensitive identity-event data and therefore require stronger operational controls. Applications receiving Persona webhooks should independently validate Persona's documented webhook signatures and payload expectations.

## Testing

Unit tests require no live Persona credential:

```bash
npm test
```

Tests cover stable tool registration, a read execution path, write denial, explicit approval, destructive denial, trusted-host enforcement, and reliability-setting validation. Live upstream integration testing should be done separately with a least-privilege Persona sandbox API key.

## Examples

See `examples/workflows.md` for read and write invocation examples and expected output envelopes.

## Limitations

- This package deliberately exposes 12 operations instead of Persona's entire 190+ MCP action surface.
- OAuth for Persona MCP is not used here; Persona's documented MCP authentication currently uses API keys, with OAuth described by Persona as forthcoming.
- No delete, decisioning, API-key administration, workflow mutation, permission change, or webhook mutation tools are exported.
- The package depends on Persona's official MCP tool metadata for runtime operation resolution and input validation. Ambiguous upstream changes fail closed.
- Identity-data access may be subject to your organization's regulatory, contractual, privacy, and security requirements; this package cannot determine those requirements for you.
