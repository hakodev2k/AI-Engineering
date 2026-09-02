# Canva connector workflows

## Discover and inspect a design

1. Tool: `canva.design.list`
   Input: `{ "query": "quarterly review", "ownership": "owned", "limit": 20 }`
   Permission: READ (`design:meta:read`). Approval: none.
   Expected output: Canva's design-list response including `items` and, when present, a `continuation` token.
2. Tool: `canva.design.get`
   Input: `{ "designId": "DESIGN_ID" }`
   Permission: READ (`design:meta:read`). Approval: none.
   Expected output: design metadata, owner, thumbnail, and temporary Canva URLs.
3. Tool: `canva.design.pages.list`
   Input: `{ "designId": "DESIGN_ID", "offset": 1, "limit": 50 }`
   Permission: READ (`design:content:read`). Approval: none. This Canva endpoint is preview.

## Safely export a presentation

1. `canva.design.export_formats.list` with `{ "designId": "DESIGN_ID" }` — READ, no approval.
2. `canva.design.export.create` with `{ "designId": "DESIGN_ID", "formatType": "pptx" }` — WRITE classification; connector-side approval is required by default.
3. `canva.design.export_job.get` with `{ "exportId": "EXPORT_JOB_ID" }` — READ, no approval. On success, Canva returns temporary download URLs that expire after 24 hours.

Example approval fingerprint:

```text
canva.design.export.create:DESIGN_ID:pptx
```

## Create a custom design

Tool: `canva.design.create`

Input:

```json
{
  "title": "Social launch card",
  "width": 1080,
  "height": 1080
}
```

Permission: WRITE (`design:content:write`). Approval: required by default.
Expected output: Canva design metadata and temporary edit/view URLs.

## Resize a design

1. Check `canva.user.capabilities.get` for the `resize` capability.
2. Call `canva.design.resize.create` with `{ "designId": "DESIGN_ID", "width": 1200, "height": 628 }` — WRITE, approval required by default.
3. Poll `canva.design.resize_job.get` with the returned job ID — READ, no approval.

## Import a public asset by URL

Tool: `canva.asset.url_upload.create`

Input:

```json
{
  "name": "Product photo",
  "url": "https://cdn.example.com/product.jpg"
}
```

Permission: WRITE (`asset:write`). Approval: required by default. The connector only accepts HTTPS and rejects localhost and literal private/loopback IP addresses. Canva documents this URL-upload API as preview.
