# MCP client examples

## Send (HIGH_RISK; approval required)
`resend.email.send` with `{ "from":"noreply@example.com", "to":["user@example.net"], "subject":"Hello", "text":"Hello", "approved":true }` returns the Resend email creation result.

## Inspect delivery object (READ)
`resend.email.get` with `{ "id":"email-id" }` returns email metadata/status.

## Manage contact (WRITE)
`resend.contact.create` with `{ "audienceId":"audience-id", "email":"user@example.net", "approved":true }` returns the created contact result.

## Delete contact (DESTRUCTIVE)
`resend.contact.delete` requires `{ "audienceId":"audience-id", "contactId":"contact-id", "approved":true }` and explicit human approval.
