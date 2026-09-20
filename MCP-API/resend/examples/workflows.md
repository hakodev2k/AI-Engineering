# Workflow examples

## Inspect delivery
Tool: `resend.email.list` → `resend.email.get`. Permission: READ. Approval: no. Output is wrapped with `trust: untrusted-provider-content`.

## Send transactional email
Tool: `resend.email.send`. Permission: HIGH_RISK. Approval: explicit `approved: true`. Input: `{ "from":"App <hello@example.com>", "to":["user@example.com"], "subject":"Welcome", "text":"Welcome!", "approved":true }`. Expected output includes the Resend email id.

## Manage audience
Use `resend.contact.list`, then `resend.contact.create` or `resend.contact.update`. Mutations are WRITE and require approval by default.

## Verify sender domain
Use `resend.domain.get` to inspect DNS state, then `resend.domain.verify` with explicit approval after DNS is configured.
