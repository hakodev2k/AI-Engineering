# CloudConvert connector workflow examples

These examples show the stable external MCP contract. Provider responses are returned as untrusted data.

## Inspect jobs (READ, no approval)

Tool: `cloudconvert.job.list`

```json
{ "status": "finished", "perPage": 20 }
```

Expected shape: `{ "ok": true, "data": { "data": [...], "links": {...}, "meta": {...} } }`.

## Convert DOCX to PDF (WRITE, approval configurable)

Tool: `cloudconvert.file.convert`

```json
{ "inputUrl": "https://files.example.com/input.docx", "outputFormat": "pdf", "approvalId": "<host-supplied-grant>" }
```

The connector prefers the official CloudConvert MCP `convertFile` tool when a valid OAuth token is configured and its discovered schema is compatible; otherwise it uses API v2 with `import/url -> convert -> export/url`.

## OCR a scanned PDF (WRITE, approval configurable)

Tool: `cloudconvert.pdf.ocr`

```json
{ "inputUrl": "https://files.example.com/scan.pdf", "languages": ["eng"], "approvalId": "<host-supplied-grant>" }
```

## Create a webhook (HIGH_RISK, approval required)

Tool: `cloudconvert.webhook.create`

```json
{ "url": "https://hooks.example.com/cloudconvert", "events": ["job.finished", "job.failed"], "approvalId": "<host-supplied-grant>" }
```

Webhook signing secrets are stripped from tool output. The receiving service must validate `CloudConvert-Signature` with its signing secret.
