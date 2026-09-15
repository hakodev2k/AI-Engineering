# Workflows

## Inspect subscribers
Tool: `buttondown.subscriber.list`
Input: `{ "page": 1, "pageSize": 50 }`
Permission: `subscriber_access=read` or `write`. Risk: READ. Approval: no.
Expected shape: `{ provider, untrustedProviderData, risk, result, rateLimit }`.

## Create a subscriber
Tool: `buttondown.subscriber.create`
Input: `{ "emailAddress": "reader@example.com", "tags": ["customer"], "approvalToken": "<payload-bound HMAC>" }`
Permission: `subscriber_access=write`. Risk: WRITE. Approval: yes by default.

## Prepare a draft
Tool: `buttondown.email.create`
Input: `{ "subject": "Weekly update", "body": "# Hello", "status": "draft", "approvalToken": "<payload-bound HMAC>" }`
Permission: `email_access=write`. Risk: WRITE. Approval: yes by default.

## Send a draft to reviewers
Tool: `buttondown.email.send_draft`
Input: `{ "id": "<email-id>", "recipients": ["reviewer@example.com"], "approvalToken": "<payload-bound HMAC>" }`
Permission: sending access appropriate to the API key. Risk: HIGH_RISK. Approval: always.

## Delete a subscriber
Tool: `buttondown.subscriber.delete`
Input: `{ "idOrEmail": "reader@example.com", "confirmIdOrEmail": "reader@example.com", "approvalToken": "<payload-bound HMAC>" }`
Permission: `subscriber_access=write`. Risk: DESTRUCTIVE. Approval: always, and `BUTTONDOWN_ENABLE_DESTRUCTIVE=true` must be set by the operator.
