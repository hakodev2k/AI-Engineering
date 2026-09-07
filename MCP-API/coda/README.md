# Coda MCP/API Connector

Reusable MCP stdio connector for Coda. It exposes 20 stable, provider-scoped tools for document, page, table, row, formula, automation, and button workflows while keeping credentials inside the connector and gating mutations behind human approval.

## Upstream transport strategy

Coda has two first-party integration surfaces relevant here:

- **Official Coda MCP:** `https://coda.io/apis/mcp`. Coda documents this remote MCP as beta and supports OAuth 2 with PKCE for supported clients or Coda personal access tokens for clients such as Codex. Coda explicitly warns that beta MCP tool names and parameters are not fixed and may change.
- **Official REST API v1:** `https://coda.io/apis/v1`. This is the primary execution transport for this connector because it provides stable deterministic endpoint contracts suitable for a reusable allow-listed MCP wrapper.

The connector does **not** proxy arbitrary or newly discovered upstream MCP tools. This is intentional: silently trusting a changing beta tool catalog could expand permissions or break stable external contracts. The official MCP endpoint is recorded for clients that want native Coda MCP access; the tools implemented by this package route through REST v1.

Official sources researched:
- Coda MCP connection/setup: https://help.coda.io/hc/en-us/articles/44722661982989-Connect-to-the-Coda-MCP
- Coda MCP tools/best practices: https://help.coda.io/hc/en-us/articles/44722756780173-Using-the-Coda-MCP
- Coda MCP security: https://help.coda.io/hc/en-us/articles/44722769665549-Security-recommendations-for-the-Coda-MCP
- Coda API v1 reference: https://coda.io/developers/apis/v1
- API/token settings: https://help.coda.io/hc/en-us/articles/39763414725389-Manage-your-Coda-account-settings
- API/doc limits: https://help.coda.io/hc/en-us/articles/39555760015757-Overview-Doc-limits
- Webhook-triggered automations: https://help.coda.io/hc/en-us/articles/39555972006541-Create-webhook-triggered-automations

## Architecture

`MCP client -> strict JSON Schema + runtime validation -> risk/approval policy -> Coda REST client -> Coda API v1`

The MCP server implements stdio JSON-RPC directly and has no runtime dependencies beyond Node.js 20+. Provider responses are wrapped with `source: untrusted_provider_data`; Coda content is data, never instructions that may alter permissions or connector behavior.

## Authentication and least privilege

Set `CODA_API_TOKEN` to a Coda API token generated from Coda account settings. The token is injected into the `Authorization: Bearer ...` header only inside `src/client.js`; it is never accepted as a tool argument, returned in outputs, or logged.

Use Coda token restrictions where practical so the token can access only required docs/resources. Coda's official MCP supports OAuth 2 with PKCE and personal access tokens; MCP PATs can be read-only, write-only, or read/write. For OAuth, Coda currently documents the broad `mcp:all` scope; use a restricted PAT when narrower access is required. Those MCP credentials are separate from this REST connector's `CODA_API_TOKEN` and are not forwarded by this package.

Workspace roles still apply. For example, creating docs/pages or performing other maker actions may require the token owner to be a Doc Maker or otherwise have sufficient workspace permissions.

## Environment

Required:
- `CODA_API_TOKEN`

Optional:
- `CODA_API_BASE_URL=https://coda.io/apis/v1` — pinned; non-official overrides are rejected.
- `CODA_MCP_URL=https://coda.io/apis/mcp` — metadata only; non-official overrides are rejected.
- `CODA_TIMEOUT_MS=15000`
- `CODA_MAX_RETRIES=3` (0-5)
- `CODA_ALLOW_WRITES=false`
- `CODA_ALLOW_HIGH_RISK=false`
- `CODA_APPROVAL_TOKEN=` — at least 16 characters when configured.

## Install and run

```bash
node --version   # >=20
npm test
CODA_API_TOKEN=... node src/server.js
```

Configure an MCP client that supports local stdio transport and the `2025-11-25` initialize handshake to run `node /path/to/MCP-API/coda/src/server.js` with secrets supplied through its secure environment/credential mechanism. The server intentionally does not claim the stateless `2026-07-28` lifecycle. Do not paste the API token into model prompts.

## Tool list

| Tool | Purpose | Risk | Approval |
|---|---|---:|---:|
| `coda.account.whoami` | Verify token/current user | READ | no |
| `coda.doc.list` | List/search docs | READ | no |
| `coda.doc.get` | Read doc metadata | READ | no |
| `coda.doc.create` | Create/copy a doc | WRITE | yes |
| `coda.page.list` | List pages | READ | no |
| `coda.page.get` | Read page metadata | READ | no |
| `coda.page.content.list` | Read page content elements | READ | no |
| `coda.page.create` | Create a page | WRITE | yes |
| `coda.page.update` | Update page metadata/content | WRITE | yes |
| `coda.table.list` | List tables/views | READ | no |
| `coda.table.get` | Read table/view details | READ | no |
| `coda.column.list` | List table columns | READ | no |
| `coda.row.list` | List/filter rows | READ | no |
| `coda.row.get` | Read one row | READ | no |
| `coda.row.upsert` | Insert/upsert one row | WRITE | yes |
| `coda.row.update` | Update one row | WRITE | yes |
| `coda.formula.list` | List named formulas | READ | no |
| `coda.formula.get` | Read formula/value | READ | no |
| `coda.automation.trigger` | Trigger configured webhook automation | HIGH_RISK | yes |
| `coda.button.push` | Push a row button | HIGH_RISK | yes |

Destructive operations such as deleting docs, pages, page content, rows, or permissions are deliberately not exposed. Sharing/ACL mutation and publishing are also omitted because they change access or public visibility.

## Permission and approval model

READ tools may run automatically. WRITE tools require all of: provider-side write access, `CODA_ALLOW_WRITES=true`, and an exact connector approval token supplied only after a human reviews the concrete change. HIGH_RISK tools additionally require `CODA_ALLOW_HIGH_RISK=true` because a Coda automation or button can cause actions outside the visible document.

The intended workflow is **Read -> Recommend/Prepare -> Human review -> Execute**. The connector never escalates its own provider token or configuration.

## Validation and safety

- Tool schemas use `additionalProperties: false` and runtime unknown-field rejection.
- IDs reject path/query delimiters and whitespace; caller-controlled URLs are not accepted.
- API/MCP base URLs are pinned to first-party Coda endpoints, preventing SSRF through configuration or tool inputs.
- Generic raw HTTP/API execution is not exposed.
- Provider content is marked untrusted and cannot alter tool registration, credentials, risk level, or approval policy.
- API token values are never emitted in normal errors or responses.
- Row writes are capped to 100 cells per call and list limits are bounded.

## Reliability, pagination, and rate limits

GET/HEAD operations use bounded retries for network errors, HTTP 429, and 5xx responses, with exponential backoff and `Retry-After` preservation. Mutating POST/PUT operations are **not retried automatically**, because several Coda writes return HTTP 202 and may already be queued; blind retries could duplicate side effects.

The client enforces request timeouts with `AbortController`. List tools expose Coda's opaque `pageToken` and return the provider's `nextPageToken` without guessing whether additional pages exist.

Coda's published API limits are per user across endpoints sharing the same bucket and currently include approximately: ordinary reads 100 requests / 6 seconds, writes 10 / 6 seconds, more restrictive doc-content writes, and doc listing 4 / 6 seconds. Coda notes these limits can change. The connector treats HTTP 429 as authoritative and avoids fan-out behavior.

Coda also documents API accessibility limits for very large docs (around 125 MB). Such provider limitations surface as normal provider errors and are not bypassed.

## Error handling

- 400: invalid/stale request or provider-side validation state.
- 401: invalid/expired API token.
- 403: token restriction, doc permission, or workspace-role denial.
- 404: resource missing or not visible to the token.
- 410: deleted page/content resource.
- 429: throttled; `Retry-After` is preserved when present.
- network/timeout: mapped to credential-safe connector errors.

Provider bodies are truncated if they are non-JSON and are never interpreted as executable instructions.

## Examples

See `examples/workflows.md` for read-inspect-update and high-risk automation flows. A typical safe update first calls `coda.row.get`, presents the exact target and proposed cells for review, then calls `coda.row.update` only after approval.

## Testing

`npm test` runs credential-free unit tests using fake `fetch` implementations. Coverage includes configuration/auth safety, endpoint pinning, strict validation, tool registration, default write denial, explicit approval, high-risk gating, bearer auth, pagination, 429 retry behavior, no write retry, and timeout mapping.

## Limitations

- The connector intentionally uses REST v1 for its stable tool contracts and does not proxy Coda's beta MCP tool catalog.
- It does not implement hosted HTTP transport; the external MCP transport is stdio.
- It does not expose destructive actions, publishing, sharing/ACL mutation, account/admin APIs, page export downloads, webhook receiving, or arbitrary Coda requests.
- Some maker actions depend on Coda workspace role/plan and token restrictions.
- Row upsert works only on base tables, not views, per Coda API behavior.
- Coda may queue writes and return HTTP 202; callers should re-read the affected resource before assuming the visible state has converged.
