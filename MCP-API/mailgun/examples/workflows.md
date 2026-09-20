# Examples

`mailgun.domain.list` input `{ "limit": 50 }` is READ and requires no approval.

`mailgun.event.list` input `{ "domain": "example.com", "limit": 100, "event": "failed" }` is READ and returns provider data as untrusted content.

`mailgun.email.send` input `{ "domain":"mg.example.com", "from":"sender@example.com", "to":"user@example.net", "subject":"Hello", "text":"Hi", "approved":true }` is WRITE and requires explicit approval. Expected success contains Mailgun's message id and status wrapped as untrusted provider data.
