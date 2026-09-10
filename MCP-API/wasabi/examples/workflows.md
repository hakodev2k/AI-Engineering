# Wasabi connector workflow examples

All examples are MCP tool inputs. Provider credentials never appear in tool arguments.

## Inventory and inspect (READ)

1. `wasabi.bucket.list` with `{}`.
2. `wasabi.bucket.location` with `{ "bucket": "example-bucket" }`.
3. `wasabi.object.list` with `{ "bucket": "example-bucket", "prefix": "reports/", "maxKeys": 100 }`.
4. `wasabi.object.metadata` with `{ "bucket": "example-bucket", "key": "reports/latest.json" }`.
5. `wasabi.object.read_text` with `{ "bucket": "example-bucket", "key": "reports/latest.json", "maxBytes": 262144 }`.

Expected output shape: MCP text content containing JSON `{ "untrustedProviderData": true, "data": ... }`. Approval is not required.

## Write an object (WRITE)

Prepare `{ "bucket": "example-bucket", "key": "agent/output.txt", "content": "reviewed text", "contentType": "text/plain" }`. A trusted human-approval component computes the HMAC token for tool `wasabi.object.put_text` and the exact payload, then adds `approvalToken`.

Required runtime policy: `WASABI_ALLOW_WRITE=true`. Approval: required.

## Temporary download URL (HIGH_RISK)

Input before approval: `{ "bucket": "example-bucket", "key": "exports/report.pdf", "expiresIn": 900 }`.

After a human approves this exact disclosure, attach the payload-bound `approvalToken` and call `wasabi.object.presign_get`. Treat the returned URL as sensitive bearer access until it expires.

Required runtime policy: `WASABI_ALLOW_WRITE=true`. Approval: always required.

## Delete an object version (DESTRUCTIVE)

Input before approval: `{ "bucket": "example-bucket", "key": "archive/old.json", "versionId": "provider-version-id" }`.

Deletion requires both `WASABI_ALLOW_DESTRUCTIVE=true` and an exact-payload `approvalToken`. The connector never retries this operation automatically.
