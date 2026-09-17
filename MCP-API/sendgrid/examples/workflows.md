# Workflow examples

- `sendgrid.template.list` — input `{ "pageSize": 20 }`; READ; no approval; output is the provider response plus HTTP/rate-limit metadata.
- `sendgrid.contact.search` — input `{ "emails": ["person@example.com"] }`; READ; no approval.
- `sendgrid.contact.upsert` — input `{ "contacts": [{"email":"person@example.com","name":"Person"}], "approved": true }`; WRITE; approval is configurable and required by default.
- `sendgrid.mail.send` — input includes verified `from`, recipients, subject/content and `approved:true`; HIGH_RISK because it sends an external message; explicit approval required.
- `sendgrid.contact.delete` — DESTRUCTIVE; requires `SENDGRID_ALLOW_DESTRUCTIVE=true` and explicit approval.
