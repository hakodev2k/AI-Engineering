# Backblaze B2 MCP/API Connector

Reusable MCP server for Backblaze B2 Cloud Storage. It exposes a small, policy-controlled tool surface over the official Backblaze S3-Compatible API using AWS SDK for JavaScript v3.

## Transport strategy

Backblaze documents two primary storage APIs: the B2 Native API and the S3-Compatible API. Backblaze recommends the S3-Compatible API for new applications and integrations because it works with a broader SDK/tool ecosystem. No official Backblaze MCP server is documented, so this connector exposes its own MCP stdio interface and uses the official S3-compatible service upstream.

The Native API is deliberately not used for features that are unnecessary here. Native-only key management and lifecycle-management operations are therefore not exposed.

Official sources:

- Backblaze APIs: https://www.backblaze.com/docs/cloud-storage-apis
- S3-Compatible API: https://www.backblaze.com/docs/cloud-storage-s3-compatible-api
- Calling the S3-Compatible API: https://www.backblaze.com/docs/cloud-storage-call-the-s3-compatible-api
- Application key capabilities: https://www.backblaze.com/docs/cloud-storage-application-key-capabilities
- S3-compatible application keys: https://www.backblaze.com/docs/cloud-storage-s3-compatible-app-keys
- Rate limits: https://www.backblaze.com/docs/cloud-storage-rate-limits
- Integration guide / AWS SDK v3 example: https://www.backblaze.com/docs/en/cloud-storage-get-started-with-a-backblaze-integration

## Runtime and architecture

Requires Node.js 20+.

```text
Agent / MCP client
  -> MCP stdio server (src/server.ts)
  -> strict tool schemas + policy gate (src/tools.ts, src/policy.ts)
  -> Backblaze client (src/client.ts)
  -> AWS SDK v3 SigV4
  -> https://s3.{region}.backblazeb2.com
```

Credentials remain inside the connector process. They are never tool parameters and are never returned to the model.

## Authentication

Create a scoped Backblaze application key. For S3 compatibility:

- `keyID` maps to `BACKBLAZE_KEY_ID` / AWS access key ID.
- `applicationKey` maps to `BACKBLAZE_APPLICATION_KEY` / AWS secret access key.
- `BACKBLAZE_REGION` is the Backblaze region, for example `us-east-005`.

Prefer bucket- and prefix-restricted application keys. Enable only the capabilities required by the tools you intend to use. Bucket-restricted S3 integrations may need `listAllBucketNames` when listing buckets.

The connector derives the endpoint from the validated region and does not accept an arbitrary endpoint URL, reducing SSRF and credential-forwarding risk.

## Environment

Copy `.env.example` values into your secret manager or process environment.

Required:

- `BACKBLAZE_KEY_ID`
- `BACKBLAZE_APPLICATION_KEY`
- `BACKBLAZE_REGION`

Safety/reliability controls:

- `BACKBLAZE_ALLOW_WRITE=false` by default.
- `BACKBLAZE_ALLOW_DESTRUCTIVE=false` by default.
- `BACKBLAZE_WRITE_APPROVAL_REQUIRED=true` by default.
- `BACKBLAZE_REQUEST_TIMEOUT_MS=20000`.
- `BACKBLAZE_MAX_ATTEMPTS=3`, bounded to 1-5.

## Install and run

```bash
npm install
npm run build
npm start
```

The server communicates over MCP stdio and can be launched by MCP clients that support stdio servers.

## Tools

| Tool | Operation | Risk | Backblaze capability | Approval |
|---|---|---|---|---|
| `backblaze.bucket.list` | List visible buckets | READ | `listBuckets` / `listAllBucketNames` | none |
| `backblaze.bucket.get` | Check bucket accessibility | READ | `listBuckets` | none |
| `backblaze.bucket.create` | Create bucket | WRITE | `writeBuckets` | configurable; required by default |
| `backblaze.bucket.delete` | Delete empty bucket | DESTRUCTIVE | `deleteBuckets` | required |
| `backblaze.object.list` | Paginated object listing | READ | `listFiles` | none |
| `backblaze.object.get_metadata` | Read object metadata | READ | `readFiles` | none |
| `backblaze.object.create_download_url` | Generate short-lived signed GET URL | READ | `readFiles` | none |
| `backblaze.object.create_upload_url` | Generate short-lived signed PUT URL for one exact key | WRITE | `writeFiles` | configurable; required by default |
| `backblaze.object.copy` | Copy object | WRITE | `readFiles`, `writeFiles` | configurable; required by default |
| `backblaze.object.delete` | Delete object | DESTRUCTIVE | generally `writeFiles` + `deleteFiles` for S3-compatible deletion semantics | required |
| `backblaze.bucket.cors.get` | Read CORS rules | READ | `readBuckets` | none |
| `backblaze.bucket.cors.set` | Replace CORS rules | HIGH_RISK | `writeBuckets` | required |
| `backblaze.bucket.cors.delete` | Remove CORS rules | DESTRUCTIVE | `writeBuckets` | required |

No generic `execute_any_api_request` tool exists.

## Permission and approval behavior

READ operations can execute automatically.

WRITE operations require `BACKBLAZE_ALLOW_WRITE=true`. When `BACKBLAZE_WRITE_APPROVAL_REQUIRED=true` (the default), the call must also contain `approved: true`.

HIGH_RISK operations always require explicit `approved: true` in addition to write enablement.

DESTRUCTIVE operations require all three conditions:

1. `BACKBLAZE_ALLOW_WRITE=true`
2. `BACKBLAZE_ALLOW_DESTRUCTIVE=true`
3. `approved: true`

The model cannot change these environment-level permissions through tool calls.

## Pagination

`backblaze.object.list` maps to S3 `ListObjectsV2`. Page size is validated between 1 and 1000. The response returns `nextContinuationToken` and `truncated`, allowing the caller to continue deliberately instead of triggering unbounded scans.

## Rate limits and retries

Backblaze currently documents a default safeguard of 500 upload/download requests per second for new accounts. S3-compatible throttling is reported as HTTP `503 SlowDown` and can include `Retry-After`.

The client:

- handles 429/500/502/503/504 and `SlowDown` with bounded exponential backoff;
- honors `Retry-After` when available;
- does not retry authentication/authorization errors;
- does not blindly retry destructive operations;
- applies an AbortController timeout to each network request;
- returns provider status/code/retry-after information through normalized MCP errors.

The AWS SDK is configured with internal retries disabled (`maxAttempts: 1`) so retry policy remains explicit in this connector.

## Security considerations

- Use scoped application keys instead of master credentials.
- Do not place keys in prompts, tool arguments, examples, logs, or source control.
- Backblaze object names and metadata are treated as untrusted provider data; MCP responses mark provider content as untrusted.
- Tool schemas are strict and reject unknown fields.
- Pre-signed URLs are short-lived capabilities. The upload URL is scoped to one exact bucket/key and is considered WRITE.
- CORS mutation is HIGH_RISK because it changes browser-origin access behavior.
- Deletions are disabled by default and cannot be retried automatically.
- The connector never accepts an arbitrary upstream URL, limiting SSRF and accidental credential forwarding.
- Retrieved object/provider content must never be interpreted as instructions that modify connector permissions or system behavior.

## Testing

```bash
npm test
```

Tests use fakes and require no live Backblaze credentials. They cover policy gates, approval boundaries, pagination input propagation, retry handling, authentication failure behavior, non-retry of destructive operations, tool uniqueness/provider scoping, and strict validation.

## Limitations

- No official Backblaze MCP server is used because Backblaze does not currently document one; this package is the MCP boundary.
- Key creation/deletion/listing is Native-API-only and intentionally unsupported.
- Native lifecycle rules, Partner API account administration, Object Lock mutation, replication administration, billing, and account/security administration are intentionally not exposed.
- Direct object upload/download bytes are not passed through the LLM. Short-lived pre-signed URLs are used instead to keep binary data and credentials out of model context.
- Bucket deletion requires the bucket to be empty, matching S3 behavior.

See `examples/workflows.md` for example MCP calls and expected output shapes.
