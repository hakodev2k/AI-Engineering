# SparkPost workflow examples

## Investigate delivery
Tool: `sparkpost.events.search`
Input: `{ "campaigns": "welcome", "events": "delivery,bounce", "perPage": 100 }`
Permission: READ. Approval: no.
Expected output: SparkPost event result envelope with pagination links when present.

## Send an approved transactional email
Tool: `sparkpost.transmission.send`
Input: `{ "recipients": [{"address":"user@example.com"}], "content": {"from":"verified@example.com","subject":"Welcome","text":"Hello"}, "idempotencyKey":"7d0b7087-7a6d-4b0e-b6b8-0d90c3ac7d68", "approved": true }`
Permission: HIGH_RISK. Approval: explicit human approval.
Expected output: SparkPost transmission result including its transmission identifier.

## Protect an unsubscribed recipient
Tool: `sparkpost.suppression.upsert`
Input: `{ "recipient":"user@example.com", "type":"non_transactional", "description":"User requested unsubscribe", "approved":true }`
Permission: HIGH_RISK. Approval: explicit human approval.
Expected output: provider confirmation.
