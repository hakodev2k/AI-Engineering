# Postmark connector workflow examples

## Inspect delivery before taking action

Tool: `postmark.email.search`

Input:
```json
{"recipient":"user@example.com","fromDate":"2026-08-20","toDate":"2026-08-26","count":20,"offset":0}
```

Permission: `READ`  
Approval: not required  
Expected output: upstream Postmark MCP result containing matching outbound messages.

Tool: `postmark.delivery.diagnose`

Input:
```json
{"recipient":"user@example.com","messageStream":"outbound"}
```

Permission: `READ`  
Approval: not required  
Expected output: delivery diagnosis assembled by the official Postmark MCP server from message, bounce, and suppression data.

## Send a transactional email

Tool: `postmark.email.send`

Arguments before approval:
```json
{"to":"user@example.com","subject":"Deployment complete","textBody":"The deployment completed successfully."}
```

Permission: `HIGH_RISK`  
Approval: required. Compute the HMAC approval token using `examples/create-approval.mjs`; the token is bound to the exact tool name and arguments. Add it as the `approval` field before executing.

Expected output: official Postmark MCP send result with the message identifier and send status.

## Register a webhook

Tool: `postmark.webhook.create`

Arguments before approval:
```json
{"url":"https://hooks.example.com/postmark","messageStream":"outbound","deliveryEnabled":true,"bounceEnabled":true}
```

Permission: `HIGH_RISK`  
Approval: required. The URL must use HTTPS and, when `POSTMARK_WEBHOOK_URL_ALLOWLIST` is configured, match an allowed prefix.

Expected output: created webhook information from the official Postmark MCP server.

## Delete a webhook

Tool: `postmark.webhook.delete`

Arguments before approval:
```json
{"webhookId":1234567}
```

Permission: `DESTRUCTIVE`  
Approval: required and bound to the exact webhook ID.

Expected output: deletion confirmation from the official Postmark MCP server.
