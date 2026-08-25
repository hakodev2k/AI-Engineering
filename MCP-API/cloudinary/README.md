# Cloudinary MCP/API Connector

Reusable MCP server for safe Cloudinary media lifecycle operations. It exposes a stable provider-scoped tool contract while using Cloudinary's official Node.js SDK for deterministic Upload/Admin/Search operations.

## Upstream strategy

Cloudinary provides official remote MCP servers using OAuth and Streamable HTTP `/mcp`, plus local MCP packages. Cloudinary documentation recommends the remote MCP endpoint for new MCP-client configurations. API-key header authentication is also supported by most Cloudinary remote MCP servers, while the Analysis MCP server currently requires OAuth.

This connector deliberately uses the official Node.js SDK for the implemented asset lifecycle capabilities because it provides complete, explicit contracts for uploads, Admin API reads, Search API reads, renames, metadata updates, and deletes while keeping credentials inside the connector process. It does not proxy arbitrary upstream MCP tools or automatically trust newly discovered upstream capabilities. The external interface remains MCP, so callers do not depend on the upstream transport choice.

Official sources researched:

- Cloudinary MCP/AI agent tools: https://cloudinary.com/documentation/cloudinary_llm_mcp
- Node.js SDK: https://cloudinary.com/documentation/node_integration
- Upload API: https://cloudinary.com/documentation/image_upload_api_reference
- Admin API: https://cloudinary.com/documentation/admin_api
- Authentication signatures: https://cloudinary.com/documentation/authentication_signatures
- Asset management: https://cloudinary.com/documentation/node_asset_administration

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict Zod tool schema
  -> permission / approval boundary
  -> CloudinaryClient
  -> official Cloudinary Node.js SDK
  -> Cloudinary Upload, Admin and Search APIs
```

Provider responses are wrapped with `untrusted_provider_content: true`. Retrieved media metadata must be treated as data, never as instructions capable of altering tool permissions or agent policy.

## Authentication

Required environment variables:

```text
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Credentials are loaded only by the connector and are never tool parameters. The LLM therefore does not need raw provider credentials.

For approved writes, also set:

```text
CLOUDINARY_APPROVAL_SECRET=
```

Approval IDs are HMAC-SHA256 digests over the exact tool name using that secret. A production host should generate these only after a human approval event and should not expose the secret to the model.

Optional reliability controls:

```text
CLOUDINARY_TIMEOUT_MS=15000
CLOUDINARY_MAX_RETRIES=2
```

Retries are bounded to 0-5. Authentication, permission, validation, not-found, conflict and destructive-operation failures are not blindly retried.

## Installation

Requires Node.js 20+.

```bash
npm install
npm run build
```

Run the MCP server over stdio:

```bash
npm start
```

A generic MCP client can launch `node /absolute/path/MCP-API/cloudinary/dist/src/server.js` with the required environment variables. Compatibility depends on the client supporting MCP stdio transport.

## Implemented tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `cloudinary.asset.list` | List assets with bounded pagination | READ | No |
| `cloudinary.asset.get` | Read one asset's metadata | READ | No |
| `cloudinary.asset.search` | Search assets with Cloudinary Search expression syntax | READ | No |
| `cloudinary.folder.list` | List root folders | READ | No |
| `cloudinary.tag.list` | List resource tags | READ | No |
| `cloudinary.usage.get` | Read account/API usage metadata | READ | No |
| `cloudinary.transformation.url` | Generate a secure delivery URL | READ | No |
| `cloudinary.asset.upload` | Upload a new asset without overwrite | WRITE | Yes |
| `cloudinary.asset.update` | Update tags/context through explicit | WRITE | Yes |
| `cloudinary.asset.rename` | Rename a public ID without overwrite | HIGH_RISK | Yes |
| `cloudinary.asset.delete` | Permanently delete one asset and invalidate CDN cache | DESTRUCTIVE | Yes + exact ID confirmation |

The connector intentionally does not expose a generic `execute_api_request` tool, account/billing mutation, security-setting mutation, mass deletion, arbitrary folder deletion, or arbitrary upstream MCP discovery.

## Permissions and approval behavior

READ tools may execute automatically. WRITE tools require a valid approval token. HIGH_RISK tools require approval and apply extra invariants; rename refuses identical source/destination IDs and disables overwrite. DESTRUCTIVE tools require approval plus an exact `confirmPublicId` match.

The connector cannot increase its own Cloudinary privileges. Least privilege must additionally be enforced by the Cloudinary credential or OAuth identity assigned to the process.

## Rate limits and reliability

Cloudinary documents the Admin API as rate-limited. The free plan includes 500 requests/hour, while paid-plan limits start higher and depend on plan. The Upload API is documented separately and is not subject to the Admin API's hourly limit, although account/platform limits may still produce throttling. Cloudinary recommends reducing concurrency and using exponential backoff when rate limited.

This connector uses bounded exponential backoff with jitter for retryable read failures and network/throttling failures. Mutating upload/update/rename/delete operations are invoked with retries disabled to prevent accidental duplicate or irreversible side effects. Pagination is surfaced using Cloudinary cursors rather than hidden unbounded iteration.

## Input validation and safety

All MCP inputs use strict bounded schemas for IDs, expressions, cursors, collection sizes and resource types. Delete requires the caller to repeat the exact public ID as confirmation. Upload uses `overwrite: false`; rename also uses `overwrite: false`.

Remote URLs passed to `cloudinary.asset.upload` are sent to Cloudinary's official uploader. A deployment that allows untrusted users to supply URLs should additionally enforce an application-specific source allowlist before tool invocation because the connector cannot infer which external hosts are acceptable for a given organization.

Secrets are not logged or returned. Provider-returned metadata is untrusted. No retrieved tag, context field, filename or metadata value can alter connector policy.

## Error handling

Cloudinary SDK/API errors propagate as MCP tool errors. The client distinguishes known non-retryable HTTP statuses (`400`, `401`, `403`, `404`, `409`, `422`) and enforces request timeouts. Consumers should present provider failures to a human rather than automatically broadening scopes or retrying destructive work.

## Testing

Unit tests require no live Cloudinary credentials:

```bash
npm test
```

Tests cover missing authentication configuration, reliability bounds, tool risk classification, read permission behavior, approval denial, valid approval and invalid approval. Live-provider integration tests are intentionally excluded from the normal unit suite to avoid requiring secrets or mutating real media.

## Limitations

- The connector exposes stdio MCP transport; it does not host an HTTP MCP endpoint itself.
- It does not implement the Cloudinary Analysis MCP server or MediaFlows automation tools.
- It does not proxy Cloudinary's official remote MCP servers because doing so would expand the trusted tool surface dynamically. Those official servers remain suitable for clients that want their broader native capability set and can use OAuth/Cloudinary credential headers directly.
- Search expressions are Cloudinary Search API expressions and are provider-defined; callers should keep them bounded and intentional.
- Transformation URL generation is non-mutating but can generate URLs for transformations that may consume transformation quota when delivered.
