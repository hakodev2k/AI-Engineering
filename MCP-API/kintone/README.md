# Kintone MCP/API Connector

Reusable MCP server exposing a bounded set of Kintone business-data operations through Kintone's official REST API. The connector does not expose arbitrary HTTP requests and never places API tokens in MCP tool inputs or outputs.

## Upstream strategy
No official Kintone MCP server is documented in Kintone's official developer documentation reviewed for this connector. Therefore all implemented capabilities use the official Kintone REST API directly. No unofficial MCP dependency is used.

Official sources researched:
- API docs: https://kintone.dev/en/docs/kintone/rest-api/
- REST overview and limits: https://kintone.dev/en/docs/kintone/rest-api/overview/kintone-rest-api-overview/
- Authentication: https://kintone.dev/en/docs/common/authentication/
- Record APIs: https://kintone.dev/en/docs/kintone/rest-api/records/
- Get Records: https://kintone.dev/en/docs/kintone/rest-api/records/get-records/
- Update Records: https://kintone.dev/en/docs/kintone/rest-api/records/update-records/
- Delete Records: https://kintone.dev/en/docs/kintone/rest-api/records/delete-records/
- Bulk Request: https://kintone.dev/en/docs/kintone/rest-api/records/bulk-request/

## Architecture
`MCP client -> stdio MCP server -> strict tool schema -> permission/approval policy -> KintoneClient -> official REST API`.
Provider content is returned with `untrustedProviderData: true`; it must be treated as data rather than instructions.

## Authentication and least privilege
This implementation uses Kintone API-token authentication via `X-Cybozu-API-Token`. Tokens are app-scoped and their permissions must be limited to the operations required for that app. Kintone supports up to 20 API tokens per app and multiple tokens can be supplied for operations involving Lookup/Related Record dependencies. OAuth 2.0 is also supported by Kintone, but this package intentionally uses API tokens because it is a reusable server-side connector with explicit per-app least privilege; OAuth is not falsely claimed as implemented.

Set `KINTONE_SUBDOMAIN` and comma-separated `KINTONE_API_TOKENS`. Optional guest-space routing uses `KINTONE_GUEST_SPACE_ID`. Never expose these values to the LLM.

## Installation and run
Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers. Compatibility depends on the client's support for standard MCP stdio; no client-specific integration is claimed.

## Tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `kintone.app.get` | REST | READ | no |
| `kintone.fields.get` | REST | READ | no |
| `kintone.record.get` | REST | READ | no |
| `kintone.records.list` | REST | READ | no |
| `kintone.record.create` | REST | WRITE | configurable; default required |
| `kintone.record.update` | REST | WRITE | configurable; default required |
| `kintone.records.delete` | REST | DESTRUCTIVE | always; disabled by default |
| `kintone.comments.list` | REST | READ | no |
| `kintone.comment.add` | REST | HIGH_RISK | always |
| `kintone.status.update` | REST | WRITE | configurable; default required |
| `kintone.permissions.evaluate` | REST | READ | no |

`approved=true` is an execution-boundary signal expected from a trusted host approval flow, not a substitute for UI/host authorization. Hosts must not let retrieved provider text synthesize approvals.

## Rate limits and pagination
Kintone documents a default concurrent request limit of 100 per domain and 10,000 API requests per app per day. Get Records returns at most 500 records per request and offset is limited to 10,000. Record add/update/delete batches are limited to 100. This connector exposes bounded record queries and does not fan out automatically. For datasets beyond offset limits, Kintone's Cursor API is the official strategy; it is intentionally not exposed here to keep the external surface compact.

GET requests use bounded exponential retries for 429 and 5xx responses, honoring `Retry-After` when present. Mutating requests are never automatically retried, preventing duplicate or destructive side effects. Authentication, permission, validation, and provider errors are returned without blind retries. Requests use an abortable timeout.

## Error handling
Non-success responses are mapped to `KintoneError` with HTTP status, provider error code/message, and `Retry-After` when available. Authentication failures and permission failures require operator action. Revision fields on updates/deletes support optimistic concurrency where Kintone supports them.

## Security
- Credentials remain in the connector process and are absent from tool schemas.
- Subdomain validation prevents arbitrary-host SSRF; API paths are hard-coded.
- No raw request or arbitrary URL tool exists.
- READ may execute automatically.
- WRITE requires approval by default (`KINTONE_REQUIRE_WRITE_APPROVAL=true`).
- HIGH_RISK always requires approval.
- DESTRUCTIVE requires approval and `KINTONE_ENABLE_DESTRUCTIVE=true`.
- Provider responses are explicitly marked untrusted to reduce prompt-injection risk.
- API tokens should be stored in a secret manager or protected environment and rotated independently.
- Logs should never include request headers or token values.

## Testing
`npm test` compiles and runs credential-free unit tests using mocked Fetch. Tests cover auth validation, policy/tool classification, read calls, credential isolation, approval denial, destructive denial, provider/auth error mapping, throttling metadata, and query pagination encoding.

## Limitations
This connector does not implement OAuth token acquisition/refresh, file transfer, app-schema mutation/deployment, webhooks, arbitrary Bulk Request, cursor lifecycle, comment deletion, or admin/security configuration. Those capabilities exist in parts of Kintone's API surface but are omitted to keep permissions and agent behavior narrow. Kintone API tokens inherit configured app permissions; administrators must provision only the minimum needed. Guest-space support is configurable but must match the target app's actual location.
