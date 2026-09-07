# Backblaze B2 MCP workflow examples

## Inspect objects

Tool: `backblaze.object.list`

Input:
```json
{"bucket":"project-assets","prefix":"builds/","maxKeys":100}
```

Expected output shape:
```json
{"data":{"items":[{"key":"builds/app.zip","size":12345,"etag":"...","lastModified":"..."}],"nextContinuationToken":"...","truncated":true},"providerContentUntrusted":true}
```

Permission: `listFiles`  
Approval: no

## Create a short-lived download URL

Tool: `backblaze.object.create_download_url`

Input:
```json
{"bucket":"project-assets","key":"builds/app.zip","expiresInSeconds":600}
```

Expected output shape:
```json
{"data":{"bucket":"project-assets","key":"builds/app.zip","expiresInSeconds":600,"url":"https://..."},"providerContentUntrusted":true}
```

Permission: `readFiles`  
Approval: no

## Prepare an upload

Tool: `backblaze.object.create_upload_url`

Input:
```json
{"bucket":"project-assets","key":"incoming/report.pdf","contentType":"application/pdf","expiresInSeconds":600,"approved":true}
```

Expected output shape:
```json
{"data":{"bucket":"project-assets","key":"incoming/report.pdf","expiresInSeconds":600,"contentType":"application/pdf","url":"https://..."},"providerContentUntrusted":true}
```

Permission: `writeFiles`  
Approval: configurable; required by default

## Delete an object

Tool: `backblaze.object.delete`

Input:
```json
{"bucket":"project-assets","key":"obsolete/report.pdf","approved":true}
```

Expected output shape:
```json
{"data":{"bucket":"project-assets","key":"obsolete/report.pdf","deleted":true},"providerContentUntrusted":true}
```

Permission: `writeFiles` + `deleteFiles`  
Approval: required, and `BACKBLAZE_ALLOW_DESTRUCTIVE=true`
