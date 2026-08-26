# Box connector workflows

## Search and inspect

Tool: `box.item.search`

Input:
```json
{"query":"quarterly plan","limit":25,"offset":0}
```

Permission: READ. Approval: no.

Expected output: Box search response wrapped as `{ "data": ..., "untrusted": true }`.

## Create a folder

Tool: `box.folder.create`

Input:
```json
{"name":"Agent Drafts","parentId":"0","approvalId":"<HMAC approval>"}
```

Permission: WRITE. Approval: yes.

## Upload a small generated artifact

Tool: `box.file.upload`

Input:
```json
{"name":"summary.txt","parentId":"123456","contentBase64":"SGVsbG8=","approvalId":"<HMAC approval>"}
```

Permission: WRITE. Approval: yes. The connector accepts base64 payloads up to the MCP schema limit; use Box chunked upload APIs outside this connector for large files.

## Comment on a file

Tool: `box.comment.create`

Input:
```json
{"fileId":"987654","message":"Review completed.","approvalId":"<HMAC approval>"}
```

Permission: WRITE. Approval: yes.

## Create a webhook

Tool: `box.webhook.create`

Input:
```json
{"targetType":"folder","targetId":"123456","address":"https://example.com/box-events","triggers":["FILE.UPLOADED"],"approvalId":"<HMAC approval>"}
```

Permission: HIGH_RISK. Approval: yes. Box V2 webhook callback addresses must use HTTPS.

## Delete a webhook

Tool: `box.webhook.delete`

Input:
```json
{"webhookId":"112233","approvalId":"<HMAC approval>"}
```

Permission: DESTRUCTIVE. Approval: yes. Also requires `BOX_ENABLE_DESTRUCTIVE=true`.
