# Dixa workflow examples

## Investigate a customer issue
1. `dixa.enduser.list` — `{ "email": "customer@example.com" }` — READ — no approval.
2. `dixa.enduser.conversations.list` — `{ "userId": "<uuid>" }` — READ — no approval.
3. `dixa.conversation.messages.list` — `{ "conversationId": 123 }` — READ — no approval.
4. `dixa.conversation.notes.list` — `{ "conversationId": 123 }` — READ — no approval.

Expected output envelope: `{ "ok": true, "risk": "READ", "data": <Dixa response> }`.

## Add an internal note
`dixa.conversation.note.create` with `{ "conversationId": 123, "text": "Order 42 verified by billing system." }`. Risk WRITE. Requires `DIXA_ALLOW_WRITES=true`; deployment policy should require human approval before invoking it.

## Escalate to another queue
`dixa.conversation.transfer.queue` with `{ "conversationId": 123, "queueId": "<uuid>", "approval": "<runtime approval token>" }`. Risk HIGH_RISK. Requires writes enabled and exact runtime approval token. Never place the approval token in prompts, examples, source control, or logs.
