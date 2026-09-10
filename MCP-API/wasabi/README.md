# Wasabi MCP/API Connector

Reusable MCP connector for Wasabi object storage. It exposes a stable, provider-scoped tool surface, keeps credentials inside the connector, applies strict validation and human-approval boundaries, and uses Wasabi-supported transports only.

## Transport strategy

Wasabi now provides an official hosted MCP service in beta. The S3 endpoint is `https://mcp.wasabisys.dev/s3`, uses Streamable HTTP, and is OAuth protected. Wasabi documents tool names with the `wasabi_s3_*` prefix and explicitly documents `wasabi_s3_list_buckets`.

This connector therefore **prefers the official Wasabi MCP server for `wasabi.bucket.list` when a trusted, pre-authorized short-lived OAuth bearer token is supplied**. If that read-only MCP call is unavailable or fails, the connector safely falls back to Wasabi's S3-compatible API.

All remaining implemented capabilities use Wasabi's documented Amazon S3-compatible API through the AWS SDK for JavaScript v3, pointed only at an official `*.wasabisys.com` HTTPS endpoint. This avoids inventing unstable beta MCP tool names while still using a provider-supported API surface. No arbitrary HTTP or arbitrary upstream-MCP tool is exposed.

Official sources researched for this connector:

- Hosted Wasabi MCP: https://docs.wasabi.com/docs/hosted-wasabi-mcp-with-ai-systems
- Cursor with Wasabi MCP: https://docs.wasabi.com/docs/cursor-with-wasabi-mcp
- Wasabi S3 API authentication: https://docs.wasabi.com/apidocs/authentication-with-s3-api
- Wasabi S3 API documentation: https://docs.wasabi.com/apidocs
- Wasabi Object Lock: https://docs.wasabi.com/apidocs/object-lock-with-the-wasabi-s3-api
- Wasabi security guidance: https://docs.wasabi.com/docs/what-are-wasabis-recommended-general-user-security-best-practices

Research was refreshed on 2026-09-10.

## Architecture

```text
MCP client / agent
        |
        v
Wasabi connector (stdio)
  - strict Zod input schemas
  - READ / WRITE / HIGH_RISK / DESTRUCTIVE policy
  - exact-payload HMAC approval
  - official-host validation
  - bounded retries for reads only
        |
        +--> official Wasabi hosted MCP /s3
        |      - OAuth bearer
        |      - allowlisted: wasabi_s3_list_buckets
        |
        `--> Wasabi S3-compatible API
               - access key + secret key
               - AWS SDK v3 transport
```

Provider-returned bucket names, object metadata, object text, and MCP responses are marked as untrusted provider data. They must never be interpreted as system instructions or authorization changes.

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`
- `zod`

Install and build:

```bash
npm install
npm run build
```

Run the connector as a local stdio MCP server:

```bash
npm start
```

Any MCP client that can launch a stdio server can use the connector. Product-specific compatibility depends on the client's MCP support.

## Authentication

### S3 API

Required environment variables:

```text
WASABI_ACCESS_KEY_ID=
WASABI_SECRET_ACCESS_KEY=
```

Wasabi's S3 API uses access/secret key credentials. Prefer a scoped sub-user instead of root credentials and attach the minimum bucket/object policy needed by the deployment. The LLM never receives either credential.

### Official Wasabi MCP

Optional:

```text
WASABI_MCP_ACCESS_TOKEN=
```

This must be a short-lived OAuth bearer token obtained by a trusted OAuth-capable MCP host or credential broker. The connector does not perform an interactive browser login or persist refresh tokens. When absent, the connector uses the S3 API path for bucket listing.

Wasabi's hosted MCP itself stores the user's underlying Wasabi credentials server-side and gives clients short-lived scoped OAuth tokens. The service is currently beta.

## Environment variables

| Variable | Required | Default | Purpose |
| --- | ---: | --- | --- |
| `WASABI_ACCESS_KEY_ID` | Yes | - | S3 access key |
| `WASABI_SECRET_ACCESS_KEY` | Yes | - | S3 secret key |
| `WASABI_REGION` | No | `us-east-1` | S3 signing/region value |
| `WASABI_ENDPOINT` | No | `https://s3.us-east-1.wasabisys.com` | Official regional S3 endpoint |
| `WASABI_TIMEOUT_MS` | No | `15000` | Per-attempt timeout, bounded 1-120 seconds |
| `WASABI_MAX_RETRIES` | No | `2` | Read retry count, bounded 0-5 |
| `WASABI_ALLOW_WRITE` | No | `false` | Enables WRITE and HIGH_RISK tools |
| `WASABI_ALLOW_DESTRUCTIVE` | No | `false` | Enables destructive tools |
| `WASABI_APPROVAL_SECRET` | For mutations | - | HMAC secret held outside model context |
| `WASABI_MCP_ACCESS_TOKEN` | No | - | Trusted short-lived OAuth bearer for official MCP |
| `WASABI_MCP_S3_URL` | No | `https://mcp.wasabisys.dev/s3` | Must remain official Wasabi MCP S3 URL |

`WASABI_ENDPOINT` is rejected unless it is HTTPS and under `wasabisys.com`. The MCP endpoint is pinned to `https://mcp.wasabisys.dev/s3`.

## Implemented tools

| Tool | Preferred transport | Risk | Approval |
| --- | --- | --- | --- |
| `wasabi.bucket.list` | Official MCP, S3 API read fallback | READ | No |
| `wasabi.bucket.location` | S3 API | READ | No |
| `wasabi.bucket.create` | S3 API | WRITE | Yes |
| `wasabi.bucket.delete` | S3 API | DESTRUCTIVE | Yes + disabled by default |
| `wasabi.object.list` | S3 API | READ | No |
| `wasabi.object.metadata` | S3 API | READ | No |
| `wasabi.object.read_text` | S3 API | READ | No |
| `wasabi.object.put_text` | S3 API | WRITE | Yes |
| `wasabi.object.copy` | S3 API | WRITE | Yes |
| `wasabi.object.delete` | S3 API | DESTRUCTIVE | Yes + disabled by default |
| `wasabi.object.presign_get` | S3 API | HIGH_RISK | Yes |
| `wasabi.object.presign_put` | S3 API | HIGH_RISK | Yes |

The connector intentionally focuses on common storage-agent workflows rather than mirroring the entire S3 API.

## Tool validation

- Bucket names are bounded and restricted to conservative S3-compatible lowercase bucket syntax.
- Object keys are limited to 1024 characters and reject NUL.
- Object listing uses explicit `maxKeys` from 1 to 1000 and optional continuation tokens.
- Text reads are capped at 1 MiB and default to 256 KiB.
- Text writes are capped at 1 MiB.
- Presigned URL lifetime is bounded to 60-604800 seconds.
- No tool accepts a provider credential or arbitrary URL.

`wasabi.object.read_text` is intentionally for bounded text-oriented inspection. It does not attempt to return arbitrary binary object bodies.

## Permission and approval model

READ tools may execute automatically.

WRITE and HIGH_RISK tools require:

1. `WASABI_ALLOW_WRITE=true`, set by the operator outside model context; and
2. a valid `approvalToken` bound to the exact tool and payload.

DESTRUCTIVE tools additionally require `WASABI_ALLOW_DESTRUCTIVE=true`.

Approval tokens are:

```text
HMAC-SHA256(
  WASABI_APPROVAL_SECRET,
  toolName + "\n" + canonicalJson(payload_without_approvalToken)
)
```

Any change to the bucket, key, content, URL lifetime, content type, version ID, or other argument invalidates the approval. The approval token is stripped before provider execution.

Generate a token outside the agent/tool path with:

```bash
WASABI_APPROVAL_SECRET='operator-held-secret' \
node examples/create-approval.mjs \
  wasabi.object.put_text \
  '{"bucket":"example-bucket","key":"agent/output.txt","content":"reviewed text","contentType":"text/plain"}'
```

The approval secret itself must never be given to the LLM.

## Real-world workflows

Typical read-only diagnosis:

```text
bucket.list
 -> bucket.location
 -> object.list
 -> object.metadata
 -> object.read_text
```

Controlled content publication:

```text
object.metadata
 -> prepare new content
 -> human approval
 -> object.put_text
```

Temporary sharing:

```text
object.metadata
 -> human confirms disclosure target + expiry
 -> object.presign_get
```

Cleanup:

```text
object.list
 -> select exact key/version
 -> human approval
 -> object.delete
```

See `examples/workflows.md` for concrete MCP inputs.

## Reliability

Provider calls have a bounded timeout. Read-only operations may retry transient failures such as HTTP 429 and selected 5xx conditions using bounded exponential backoff. Mutating and destructive operations are single-attempt by design so ambiguous failures cannot create duplicate writes or repeated deletions.

Authentication, authorization, validation, and ordinary 4xx failures are not blindly retried.

The connector sets the AWS SDK S3 client's own automatic retry attempts to one and owns retry policy explicitly at the connector layer.

## Rate limits

Wasabi's public documentation describes rate limits for some management APIs, while S3 traffic behavior may depend on workload/account characteristics. This connector does not invent a single global S3 requests-per-second limit. It treats provider throttling responses as authoritative and retries only safe reads within the configured bound.

Pagination is explicit rather than recursive, preventing an agent from accidentally walking an entire large bucket in one tool invocation.

## MCP security

The official hosted Wasabi MCP is used only for the single exact allowlisted upstream tool `wasabi_s3_list_buckets`, whose name is explicitly documented by Wasabi. The connector calls upstream `tools/list` and refuses to invoke that capability if it is no longer advertised.

New or unexpected upstream tools are never automatically forwarded. The connector never passes S3 access/secret keys to the MCP server; only a trusted OAuth bearer is used for the MCP transport.

If the read-only official MCP call fails, fallback to the S3 API is safe because listing buckets is idempotent and side-effect free. No mutation is replayed across transports.

## Security considerations

- Keep S3 credentials and approval secrets in a process secret store.
- Prefer scoped sub-users; Wasabi explicitly recommends avoiding root access keys.
- Provider content is untrusted data and cannot change risk classes or permissions.
- Presigned URLs are HIGH_RISK because anyone possessing the URL can use the delegated access until expiry.
- Put-presigned URLs delegate write capability and therefore require explicit approval.
- Destructive operations are disabled by default.
- The connector does not expose bucket policy changes, IAM changes, access-key management, billing, WACM administration, Object Lock bypass, legal-hold changes, or arbitrary S3 calls.
- Object Lock and versioning rules remain enforced by Wasabi. The connector does not offer governance-retention bypass headers.

## Error handling

Provider failures are normalized as connector errors without returning credentials. Throttling is distinguishable from other provider failures. Timeouts and network/provider errors fail after the configured bounded retry policy.

Because S3 delete semantics and versioning can be subtle, callers should inspect object metadata/version state before requesting deletion.

## Testing

Normal unit tests require no live Wasabi credentials:

```bash
npm test
```

The test suite covers:

- missing authentication configuration;
- official endpoint enforcement;
- safe write/destructive defaults;
- complete risk classification for all tools;
- read authorization;
- write denial;
- exact-payload approval binding;
- approval invalidation after payload mutation;
- independent destructive-operation gate;
- approval stripping before provider forwarding.

Live provider tests are intentionally excluded from the default suite because they would require real credentials and could mutate paid object storage.

## Limitations

- The official Wasabi MCP service is beta and its broader tool catalog can evolve.
- Only `wasabi_s3_list_buckets` is proxied through hosted MCP because that exact upstream name is currently documented; other capabilities use the stable Wasabi S3-compatible API instead of guessing beta MCP names.
- Interactive OAuth authorization and refresh-token persistence are expected to be handled by a trusted outer MCP host or credential broker.
- This connector does not upload/download local files directly. It provides bounded text operations and presigned URLs instead, reducing filesystem authority in the MCP process.
- Multipart upload, bucket policy, replication, lifecycle, event notifications, IAM/STS, WACM, Object Lock mutation, and bulk delete are intentionally omitted.
- S3-compatible behavior remains subject to Wasabi's documented implementation and account permissions.
