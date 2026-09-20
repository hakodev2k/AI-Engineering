# Workflows

- `resend.email.list` — `{"limit":25}` — READ, no approval; returns a bounded page of provider data.
- `resend.domain.get` — `{"id":"00000000-0000-0000-0000-000000000000"}` — READ, no approval.
- `resend.email.send` — `{"from":"Example <sender@example.com>","to":["user@example.com"],"subject":"Welcome","text":"Hello","approved":true}` — WRITE, explicit approval required; successful output contains Resend's email id.
- `resend.contact.create` — `{"email":"user@example.com","name":"Ada","approved":true}` — WRITE, explicit approval required.
