# Workflows

- `resend.email.list` — `{ "limit": 50 }`; READ; no approval; returns provider email records as untrusted data.
- `resend.domain.get` — `{ "id": "00000000-0000-0000-0000-000000000000" }`; READ; no approval.
- `resend.email.send` — `{ "from":"sender@example.com","to":["user@example.com"],"subject":"Welcome","text":"Hello","approved":true }`; WRITE; explicit approval required.
- `resend.contact.create` — `{ "email":"user@example.com","firstName":"Ada","approved":true }`; WRITE; explicit approval required.
