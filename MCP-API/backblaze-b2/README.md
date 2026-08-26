# Backblaze B2 MCP/API Connector

Reusable MCP server for Backblaze B2 Cloud Storage. It exposes a deliberately scoped set of storage operations as stable MCP tools while keeping Backblaze credentials inside the connector process.

## Transport decision

Research performed against current Backblaze documentation on 2026-08-26 found official B2 Native API and S3-Compatible API documentation, but no official Backblaze-operated MCP server. This connector therefore uses the official Backblaze S3-Compatible API via AWS SDK for JavaScript v3, which Backblaze explicitly documents as a supported S3-compatible SDK approach.

Official sources:

- Backblaze APIs: https://www.backblaze.com/docs/cloud-storage-apis
- S3-Compatible API: https://www.backblaze.com/docs/cloud-storage-s3-compatible-api
- S3 API introduction/authentication: https://www.backblaze.com/apidocs/introduction-to-the-s3-compatible-api
- Supported S3 operations: https://www.backblaze.com/docs/cloud-storage-api-operations
- S3-Compatible app-key permissions: https://www.backblaze.com/docs/cloud-storage-s3-compatible-app-keys
- S3-Compatible SDK guidance: https://www.backblaze.com/docs/cloud-storage-s3-compatible-sdks
- Transaction/rate-cost reference: https://www.backblaze.com/cloud-storage/transaction-pricing

No unofficial MCP server is a runtime dependency.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> validation + allowlists + approval policy
  -> BackblazeClient
  -> AWS SDK v3 / SigV4
  -> Backblaze B2 S3-Compatible API
```

Credentials are read only from process environment variables. They are never accepted as MCP arguments and are not included in normal tool output or error text.

## Runtime

- Node.js 20+
- npm
- HTTPS access to the configured Backblaze S3 endpoint

Install and build:

```bash
npm install
npm run build
```

Run over stdio:

```bash
npm start
```

Development tests:

```bash
npm test
```

Normal unit tests use mocks and do not require live Backblaze credentials.

## Authentication

The S3-Compatible API uses AWS Signature Version 4. Configure a Backblaze application key ID as the access-key ID and its application key as the secret-access key. Backblaze documents that the master application key is not supported for the S3-Compatible API; create a dedicated application key instead.

Use the narrowest application-key capabilities and, where possible, restrict it to the intended bucket/file prefix. The connector adds its own bucket/prefix allowlists as a second boundary.

Environment variables:

| Variable | Required | Purpose |
|---|---:|---|
| `B2_KEY_ID` | yes | Backblaze application key ID / S3 access-key ID |
| `B2_APPLICATION_KEY` | yes | Backblaze application key / S3 secret key |
| `B2_REGION` | yes | Account region such as `us-west-004` |
| `B2_ENDPOINT` | yes | HTTPS S3 endpoint such as `https://s3.us-west-004.backblazeb2.com` |
| `B2_ALLOWED_BUCKETS` | no | Comma-separated bucket allowlist; empty means connector-level bucket allowlist is disabled |
| `B2_ALLOWED_PREFIXES` | no | Comma-separated object-key prefix allowlist |
| `B2_REQUIRE_WRITE_APPROVAL` | no | Defaults to `true`; may disable approval for `WRITE`, never `DESTRUCTIVE` |
| `B2_APPROVAL_SECRET` | conditional | Secret used to verify request-bound approval tokens |
| `B2_TIMEOUT_MS` | no | Per-request cancellation timeout; default 20000, bounded 1000–120000 |
| `B2_MAX_READ_BYTES` | no | Maximum object size returned by `read_text`; default 1 MiB, maximum 10 MiB |

`B2_ENDPOINT` is validated to HTTPS and a `*.backblazeb2.com` hostname to prevent arbitrary endpoint/SSRF configuration.

## Implemented tools

| Tool | Purpose | Backblaze capability | Risk | Approval |
|---|---|---|---|---|
| `backblaze.bucket.list` | List accessible buckets | `listBuckets`; restricted-key listing may also need `listAllBucketNames` | READ | no |
| `backblaze.bucket.head` | Check bucket accessibility | `listBuckets` | READ | no |
| `backblaze.object.list` | List objects with continuation-token pagination | `listFiles` | READ | no |
| `backblaze.object.version.list` | List versions and delete markers | `listFiles` | READ | no |
| `backblaze.object.head` | Read object metadata | `readFiles` | READ | no |
| `backblaze.object.read_text` | Read a bounded UTF-8 object | `readFiles` | READ | no |
| `backblaze.object.presign_download` | Generate a short-lived signed GET URL | `readFiles` | READ | no |
| `backblaze.object.presign_upload` | Generate a short-lived signed PUT URL | `writeFiles` | WRITE | yes by default |
| `backblaze.object.write_text` | Upload bounded UTF-8 text | `writeFiles` | WRITE | yes by default |
| `backblaze.object.copy` | Copy an object to an allowed destination | `readFiles`, `writeFiles` | WRITE | yes by default |
| `backblaze.object.delete` | Delete by key or specific version ID | `writeFiles`, `deleteFiles` | DESTRUCTIVE | always |

All operations are implemented through Backblaze's S3-Compatible API. The connector does not claim Native-API-only account administration, key administration, lifecycle-rule mutation, or unsupported S3 features.

## Approval model

READ operations can execute automatically after schema and resource-boundary validation.

WRITE operations require explicit approval by default. `B2_REQUIRE_WRITE_APPROVAL=false` can relax only ordinary WRITE operations for a trusted deployment. It does not relax `backblaze.object.delete`.

DESTRUCTIVE operations always require approval.

Approval is request-bound. The verifier computes:

```text
HMAC-SHA256(
  B2_APPROVAL_SECRET,
  tool_name + "\n" + canonical_json_without_approval
)
```

The resulting lowercase 64-character hex digest is supplied as the tool's `approval` field. The approval secret remains in the connector environment rather than the agent context. A token for one tool/input does not authorize a different tool/input.

## Reliability and pagination

The AWS SDK client is configured with bounded retries (`maxAttempts: 3`). SDK retry logic handles transient service throttling/server failures with its standard strategy; permission and validation failures are surfaced rather than retried indefinitely.

Each provider call also receives an abort signal with `B2_TIMEOUT_MS`.

List tools expose provider-native pagination state rather than silently scanning whole buckets:

- `backblaze.object.list` accepts/returns continuation tokens and limits each call to at most 1000 keys.
- `backblaze.object.version.list` accepts/returns key/version markers and limits each call to at most 1000 entries.

This keeps transaction volume and agent-visible result size bounded. Backblaze pricing/rate behavior can change by transaction class, so consult the official transaction pricing page for current limits/costs.

## Error handling

- 401/403 are mapped to a sanitized authorization-denied error.
- 429 is mapped to a rate-limit error.
- request cancellation is surfaced as a timeout error.
- provider request IDs are preserved when available for diagnostics.
- credentials are not appended to errors.
- validation and allowlist failures occur before provider calls where possible.

## Security considerations

### Credential isolation

The model never supplies `B2_KEY_ID` or `B2_APPLICATION_KEY`. They live only in the connector process/environment and AWS SDK credential layer.

### Resource isolation

Set `B2_ALLOWED_BUCKETS` and `B2_ALLOWED_PREFIXES` in multi-project or agent deployments. Connector allowlists do not replace Backblaze application-key restrictions; use both.

### Untrusted storage content

Object text returned by `backblaze.object.read_text` is explicitly marked `untrustedContent: true`. Callers must treat downloaded content as data, not instructions, and must not allow stored prompt-injection text to modify permissions, approval rules, system prompts, or tool routing.

### Pre-signed URLs

Pre-signed URLs are bearer capabilities. Avoid logging them, putting them into public chats, or choosing long expiry periods. The connector bounds expiry to 60 seconds through 7 days and defaults to 15 minutes.

### Versioned deletes

Backblaze B2 buckets are versioned. Deleting by object name can make an older version become current rather than erasing all history. Use `backblaze.object.version.list` before deletion when exact version semantics matter, and pass a `versionId` to delete a specific version.

### SSRF and arbitrary requests

There is no generic `execute_request`, raw URL fetch, or arbitrary S3-command tool. The endpoint is configuration-only and restricted to HTTPS Backblaze hosts. Object and bucket values are validated before use.

## MCP client configuration

After building, configure an MCP client to execute the connector process using stdio. For example, clients that accept command/args configuration can launch:

```json
{
  "command": "node",
  "args": ["/absolute/path/MCP-API/backblaze-b2/dist/server.js"],
  "env": {
    "B2_KEY_ID": "set-outside-source-control",
    "B2_APPLICATION_KEY": "set-outside-source-control",
    "B2_REGION": "us-west-004",
    "B2_ENDPOINT": "https://s3.us-west-004.backblazeb2.com",
    "B2_ALLOWED_BUCKETS": "your-bucket"
  }
}
```

Do not commit real credentials into MCP configuration files that are tracked by source control.

## Testing

`tests/connector.test.ts` covers:

- configuration validation
- HTTPS/Backblaze endpoint restriction
- bucket and prefix permission denial
- write approval and request binding
- non-bypassable destructive approval
- pagination/result normalization with a mocked SDK transport
- bounded text reads
- provider authorization error mapping

The tests are credential-free.

## Examples

See `examples/workflows.md` for list/read, pre-signed upload, copy, and version-specific delete workflows with required permissions, risk classification, approval behavior, and expected output shapes.

## Limitations

- No official Backblaze MCP transport was identified in current official documentation, so upstream transport is S3-compatible HTTPS rather than MCP.
- This connector intentionally omits bucket creation/deletion, ACL mutation, encryption mutation, Object Lock mutation, and key administration because they are less suitable for autonomous agent defaults and require broader permissions.
- `read_text` is for bounded UTF-8 content, not arbitrary binary downloads.
- `write_text` is intentionally limited to 1 MiB. Use `presign_upload` for larger/binary uploads.
- S3 object tagging is not fully supported by Backblaze and is not exposed.
- The S3-Compatible API does not support all AWS S3 features (for example IAM roles and website configuration); unsupported features are not represented as MCP tools.
