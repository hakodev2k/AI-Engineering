# Backblaze B2 MCP workflow examples

All examples assume the connector has already been configured with credentials and resource allowlists. Provider content must be treated as untrusted data.

## Inspect and read a report

Tool: `backblaze.object.list`

Input:
```json
{"bucket":"safe-bucket","prefix":"reports/","maxKeys":50}
```

Permission: `listFiles`  
Risk: `READ`  
Approval: no

Expected output shape:
```json
{"objects":[{"key":"reports/example.txt","size":123,"etag":"...","lastModified":"..."}],"prefixes":[],"truncated":false}
```

Then call `backblaze.object.read_text`:
```json
{"bucket":"safe-bucket","key":"reports/example.txt"}
```

Permission: `readFiles`  
Risk: `READ`  
Approval: no

Expected output includes metadata, UTF-8 `text`, and `untrustedContent: true`.

## Prepare a direct upload

Tool: `backblaze.object.presign_upload`

Input before approval token:
```json
{"bucket":"safe-bucket","key":"agents/input.json","contentType":"application/json","expiresIn":900}
```

Permission: `writeFiles`  
Risk: `WRITE`  
Approval: required by default

The approval token is an HMAC-SHA256 over the tool name and the connector's canonicalized input, using `B2_APPROVAL_SECRET`. The secret remains outside the model/tool arguments. Once approved, the tool returns a short-lived URL and `method: "PUT"`.

## Copy an object

Tool: `backblaze.object.copy`

Input before approval token:
```json
{"sourceBucket":"safe-bucket","sourceKey":"reports/example.txt","destinationBucket":"safe-bucket","destinationKey":"reports/archive/example.txt"}
```

Permissions: `readFiles`, `writeFiles`  
Risk: `WRITE`  
Approval: required by default

Expected output shape:
```json
{"sourceBucket":"safe-bucket","sourceKey":"reports/example.txt","destinationBucket":"safe-bucket","destinationKey":"reports/archive/example.txt","etag":"...","versionId":"..."}
```

## Delete one version

Tool: `backblaze.object.delete`

Input before approval token:
```json
{"bucket":"safe-bucket","key":"reports/example.txt","versionId":"4_z..."}
```

Permissions: `writeFiles`, `deleteFiles`  
Risk: `DESTRUCTIVE`  
Approval: always required

Expected output shape:
```json
{"bucket":"safe-bucket","key":"reports/example.txt","requestedVersionId":"4_z...","deletedVersionId":"4_z...","deleteMarker":false}
```

Deleting by name rather than version can reveal an older version because Backblaze B2 buckets are versioned. Use `backblaze.object.version.list` first when version semantics matter.
