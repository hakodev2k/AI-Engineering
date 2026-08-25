# Brevo connector workflows

## Contact review
1. `brevo.contact.list` — READ — no approval.
2. `brevo.contact.get` — READ — no approval.

Expected result: Brevo JSON contact objects wrapped as MCP text content.

## Prepare a campaign draft
1. Inspect contacts with `brevo.contact.list`.
2. Obtain a human-generated approval token bound to the exact `brevo.campaign.create` arguments.
3. Call `brevo.campaign.create` — WRITE — approval required. It creates a draft only; it does not send the campaign.

## Send a transactional message
Call `brevo.email.send` with a verified sender, recipients, and either a template or message body. Permission: HIGH_RISK. Explicit argument-bound approval required because this sends an external message.

## Webhook lifecycle
- `brevo.webhook.list` — READ.
- `brevo.webhook.create` — HIGH_RISK, approval required; URL must be HTTPS and cannot target obvious loopback/private addresses.
- `brevo.webhook.delete` — DESTRUCTIVE, approval required and `BREVO_ALLOW_DESTRUCTIVE=true`.
