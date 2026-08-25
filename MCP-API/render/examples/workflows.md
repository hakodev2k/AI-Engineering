# Render connector workflow examples

## Investigate a failed deploy

1. `render.service.list` with `{ "workspaceId": "tea-...", "includePreviews": false }` — READ, no approval.
2. `render.deploy.list` with `{ "serviceId": "srv-...", "limit": 5 }` — READ, no approval.
3. `render.logs.list` with `{ "resource": ["srv-..."], "level": ["error"], "limit": 100 }` — READ, no approval.
4. `render.metrics.get` with `{ "resourceId": "srv-...", "metricTypes": ["cpu_usage", "memory_usage"] }` — READ, no approval.

Expected output shape for all tools: `{ "data": <provider result>, "untrustedProviderContent": true }`.

## Trigger a controlled redeploy

Tool: `render.deploy.trigger`

Input: `{ "serviceId": "srv-...", "clearCache": false, "approvalId": "<HMAC approval token>" }`

Permission: HIGH_RISK. Approval: required by default. The approval token is derived outside the LLM context as `HMAC-SHA256(RENDER_APPROVAL_SECRET, "render.deploy.trigger:<serviceId>")`.

## Operational service control

Tools: `render.service.restart`, `render.service.suspend`, `render.service.resume`

Input: `{ "serviceId": "srv-...", "approvalId": "<HMAC approval token>" }`

Permission: HIGH_RISK. Approval: required by default. These operations use the official Render REST API and are not retried automatically.
