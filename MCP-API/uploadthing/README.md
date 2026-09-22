# UploadThing MCP/API Connector

Reusable MCP server for safe UploadThing file administration. The connector exposes a deliberately small agent-facing contract while using UploadThing's official TypeScript server SDK (`UTApi`). UploadThing also publishes an OpenAPI-described REST API at `https://api.uploadthing.com`; no official UploadThing MCP server was identified during implementation, so this package uses the official SDK rather than an unofficial MCP intermediary.

## Official sources

- Docs: https://docs.uploadthing.com/
- UTApi: https://docs.uploadthing.com/api-reference/ut-api
- REST/OpenAPI: https://docs.uploadthing.com/api-reference/openapi-spec
- Authentication/security: https://docs.uploadthing.com/concepts/auth-security
- Files: https://docs.uploadthing.com/working-with-files

## Transport and architecture

`MCP client -> this stdio MCP server -> approval gate -> UTApi -> UploadThing API/storage`

The LLM never receives `UPLOADTHING_TOKEN`. Provider responses are data, never instructions. There is no arbitrary HTTP-request tool, and URL ingestion accepts HTTPS only to reduce SSRF exposure. Tool inputs are bounded and validated with Zod.

## Authentication

Create an UploadThing application and obtain its server token/API credential. Set `UPLOADTHING_TOKEN` only in the connector environment. UploadThing's REST specification authenticates API calls with its API credential; the official SDK encapsulates provider request details. Never expose the token to browser code, prompts, logs, examples, or tool arguments.

## Installation

Requires Node.js 20+.

```bash
npm install
npm run build
UPLOADTHING_TOKEN=... npm start
```

For an MCP client, configure the command as `node /absolute/path/to/MCP-API/uploadthing/dist/src/index.js` and inject environment variables through the client's secure MCP environment configuration.

## Tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `uploadthing.file.list` | Paginated administrative file listing | READ | No |
| `uploadthing.usage.get` | Retrieve application usage | READ | No |
| `uploadthing.file.signed_url` | Generate a private-file URL valid up to 7 days | READ | No |
| `uploadthing.file.upload_url` | Import an HTTPS resource | WRITE | Required |
| `uploadthing.file.rename` | Rename one file | WRITE | Required |
| `uploadthing.file.acl_update` | Change public/private ACL | HIGH_RISK | Required |
| `uploadthing.file.delete` | Permanently delete up to 50 files | DESTRUCTIVE | Required |

UploadThing documents `listFiles` as suitable for administration, synchronization, and debugging rather than as an application's primary database. The connector therefore keeps listing explicitly bounded. Signed URLs are generated through the SDK and are limited to UploadThing's documented seven-day maximum.

## Approval model

READ operations run automatically. Mutating operations fail closed with `APPROVAL_REQUIRED` unless the exact tool name is present in `UPLOADTHING_APPROVED_TOOLS`. Example for a single approved action:

```bash
UPLOADTHING_APPROVED_TOOLS=uploadthing.file.rename
```

Approval is capability-specific rather than global. An agent cannot modify the environment through any exposed tool. For production, inject approval state from a short-lived supervisor process instead of leaving write tools permanently approved.

## Reliability and rate limiting

The official SDK owns provider transport and provider-error handling. Calls are deliberately coarse-grained: listing is paginated, bulk deletion is capped at 50 keys, and no recursive enumeration exists. Provider throttling and network failures are returned as errors rather than hidden behind unbounded retries; this avoids blindly replaying writes or destructive operations. Callers may retry safe READ operations with bounded exponential backoff. Do not automatically retry DELETE/ACL/write actions unless the provider result proves the operation did not execute.

`UPLOADTHING_TIMEOUT_MS` is reserved for host-level process supervision; MCP hosts should enforce cancellation/timeouts around tool calls because the SDK does not expose an AbortSignal consistently across these operations.

## Security

Keep credentials server-side and use a dedicated UploadThing application/credential where practical. Treat filenames, remote content, metadata, and URLs as untrusted data. `uploadthing.file.upload_url` permits HTTPS only; deployments requiring stricter SSRF controls should additionally enforce an outbound allowlist at the network layer. ACL changes and deletion always require explicit approval. Error messages are scrubbed for common credential patterns before crossing the MCP boundary.

UploadThing callback endpoints used by application File Routers must remain reachable by UploadThing; current SDKs verify signed callback data. This connector does not expose or implement callback endpoints.

## Testing

```bash
npm test
npm run build
```

Unit tests require no live UploadThing credential. They cover missing authentication, read defaults, write denial, explicit approval, destructive classification, and dependency injection for provider mocking.

## Limitations

This connector intentionally does not expose raw REST access, API-key management, billing changes, application settings, callback endpoints, or deprecated `getFileUrls`. It does not use an unofficial MCP server. UploadThing recommends storing application file metadata in your own database rather than repeatedly using `listFiles` in latency-sensitive application flows.

See `examples/workflows.md` for invocation shapes.
