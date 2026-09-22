# Workflows

- `postmark.template.list` — input `{"count":50,"offset":0}`; READ; no approval; output is Postmark's template list wrapped as untrusted provider data.
- `postmark.message.outbound.get` — input `{"messageId":"00000000-0000-0000-0000-000000000000"}`; READ; no approval.
- `postmark.email.send_template` — input `{"from":"sender@example.com","to":"user@example.com","templateAlias":"welcome","templateModel":{"name":"Ada"},"messageStream":"outbound","approved":true}`; WRITE; explicit approval required; output includes Postmark MessageID on success.
