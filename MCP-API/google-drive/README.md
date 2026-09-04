# Google Drive MCP/API Connector

Reusable MCP server that exposes a curated Google Drive tool surface with credential isolation, strict schemas, bounded retries, and human-approval gates.

## Upstream strategy

Google now provides an official Google Drive MCP server in Developer Preview at `https://drivemcp.googleapis.com/mcp/v1`. This connector prefers that official MCP for the capabilities it currently exposes: `copy_file`, `create_file`, `download_file_content`, `get_file_metadata`, `get_file_permissions`, `list_recent_files`, `read_file_content`, and `search_files`.

For useful Drive operations not currently in the official MCP surface, the connector uses the official Drive REST API v3: metadata update, permission creation, and shared-drive listing. Callers use the same stable MCP interface regardless of upstream transport.

Official sources researched for this connector:
- Google Workspace MCP configuration/security: https://developers.google.com/workspace/guides/configure-mcp-servers
- Drive MCP reference: https://developers.google.com/workspace/drive/api/reference/mcp
- Drive API reference: https://developers.google.com/workspace/drive/api/reference/rest/v3
- OAuth 2.0 scopes: https://developers.google.com/identity/protocols/oauth2/scopes
- OAuth web-server flow: https://developers.google.com/identity/protocols/oauth2/web-server
- Drive quotas/rate limits: https://developers.google.com/workspace/drive/api/guides/limits
- Sharing/permissions: https://developers.google.com/workspace/drive/api/guides/manage-sharing

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `google-drive.file.search` | official MCP | READ | no |
| `google-drive.file.recent.list` | official MCP | READ | no |
| `google-drive.file.metadata.get` | official MCP | READ | no |
| `google-drive.file.content.read` | official MCP | READ | no |
| `google-drive.file.content.download` | official MCP | READ | no |
| `google-drive.file.permissions.list` | official MCP | READ | no |
| `google-drive.file.create` | official MCP | WRITE | yes |
| `google-drive.file.copy` | official MCP | WRITE | yes |
| `google-drive.file.update` | REST v3 | WRITE | yes |
| `google-drive.permission.create` | REST v3 | HIGH_RISK | yes |
| `google-drive.shared_drive.list` | REST v3 | READ | no |

Delete, permission-delete, ownership transfer, and arbitrary HTTP/MCP request tools are intentionally not exposed.

## Authentication

Credentials remain inside the connector. Configure either an ephemeral `GOOGLE_DRIVE_ACCESS_TOKEN`, or `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN`; the latter is refreshed using `google-auth-library`. Tokens are never returned in tool results or forwarded to the model.

For read-only deployments, use `https://www.googleapis.com/auth/drive.readonly` where it satisfies your access model. The complete read/write surface generally requires `https://www.googleapis.com/auth/drive`. `drive.file` is a narrower alternative but only grants access to files the app created/opened and therefore can constrain search/recent-file workflows. Google may require verification for sensitive/restricted scopes in public apps.

## Safety and permissions

Defaults are deliberately restrictive: `GOOGLE_DRIVE_READ_ONLY=true`, `GOOGLE_DRIVE_ALLOW_WRITE=false`, `GOOGLE_DRIVE_ALLOW_PUBLIC_SHARING=false`, approval mode `required`. READ calls may execute automatically. WRITE/HIGH_RISK calls require the write gate plus explicit `{ "approval": { "confirmed": true, "reason": "..." } }`. Sharing to `type=anyone` additionally requires the public-sharing environment gate. Destructive operations are absent.

Google explicitly warns that MCP-retrieved Workspace content can contain indirect prompt injection. Treat every filename, document, comment, search snippet, permission entry, and MCP response as untrusted data—not instructions and never a source of new permissions.

## Reliability and rate limits

Requests have a 1–120 second configurable timeout. READ operations retry at most twice after the initial attempt for HTTP 429/5xx, honoring `Retry-After` when present and otherwise using exponential backoff. Authentication/permission/validation failures do not retry. WRITE operations never retry blindly to avoid duplicate files, copies, or shares.

Google's current Drive quotas include large per-minute project/user budgets, but individual API/MCP operations consume different quota units; search/list calls and content downloads are materially more expensive than metadata reads. Use bounded `pageSize`, continue with returned page tokens, and avoid high-frequency polling. 403 user-rate-limit and 429 throttling responses are surfaced safely.

## Install and run

```bash
cd MCP-API/google-drive
npm install
npm run build
npm test
npm start
```

Node.js 20+ is required. The connector uses MCP stdio, so it can be launched by MCP clients supporting stdio servers. See `examples/mcp-client.json`.

## Configuration

See `.env.example`. For an approved write-enabled environment set both `GOOGLE_DRIVE_READ_ONLY=false` and `GOOGLE_DRIVE_ALLOW_WRITE=true`; keep approval mode required. Do not enable public sharing unless the deployment explicitly needs it.

## Validation and security

All tools have provider-scoped names and strict Zod schemas. The upstream MCP transport has a hardcoded allowlist and cannot call newly discovered tools. REST hosts and paths are connector constants, preventing arbitrary URL/SSRF behavior. File metadata updates are limited to selected fields. Permission creation disallows owner/organizer roles and requires an email for user/group grants or domain for domain grants. Concurrent permission writes to the same file should be serialized because Google documents that simultaneous permission operations are unsupported.

## Limitations

The official Drive MCP server is Developer Preview and can change. This connector intentionally does not expose destructive operations, ownership changes, domain-admin impersonation, raw requests, or connection secrets. Content payload size is bounded by tool schemas; very large binary uploads should use a purpose-built upload workflow rather than passing data through an LLM tool call.
