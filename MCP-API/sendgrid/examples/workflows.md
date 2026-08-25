# SendGrid connector workflows

## Inspect account before sending

Tool: `sendgrid.account.scopes.get`

Input: `{}`

Permission: `READ`

Approval: no

Expected output shape: `{ "data": { "scopes": ["..."] }, "untrusted_provider_content": true }`

Then use `sendgrid.sender.list` and `sendgrid.suppression.global.get` to verify sender configuration and recipient suppression status before proposing a send.

## Create a dynamic template

Tool: `sendgrid.template.create`

Input: `{ "name": "Transactional receipt", "generation": "dynamic", "approvalId": "<payload-bound HMAC>" }`

Permission: `WRITE`

Approval: yes, plus `SENDGRID_ALLOW_WRITES=true`

Then call `sendgrid.template.version.create` with the returned template ID and an independently approved payload. Keeping the version inactive (`active: false`) lets a human review it before activation outside this connector.

## Send one approved email

Tool: `sendgrid.email.send`

Input: `{ "from": "verified@example.com", "to": "recipient@example.com", "subject": "Status update", "text": "Your job completed.", "approvalId": "<payload-bound HMAC>" }`

Permission: `HIGH_RISK`

Approval: yes, plus `SENDGRID_ALLOW_HIGH_RISK=true`

Expected output shape: `{ "data": null, "untrusted_provider_content": true }` when SendGrid returns HTTP 202 with an empty response body.

The tool intentionally does not expose suppression-bypass controls.

## Manage global suppression safely

Read current status with `sendgrid.suppression.global.get`. To add an address to the global unsubscribe list, use `sendgrid.suppression.global.add` with WRITE approval. Removing a global suppression uses `sendgrid.suppression.global.remove`, is classified `HIGH_RISK`, and requires explicit payload-bound approval because it can make the recipient eligible to receive email again.

## Configure Event Webhook

Read first with `sendgrid.webhook.event.get`. `sendgrid.webhook.event.update` only accepts HTTPS destinations and requires high-risk approval because it changes where SendGrid delivery/event data is sent.
