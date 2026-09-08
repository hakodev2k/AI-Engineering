# Crisp workflow examples

## Triage inbox
- `crisp.conversation.list` input: `{ "filter_unread": true, "per_page": 20 }` — READ — no approval.
- `crisp.conversation.get` input: `{ "session_id": "session_<uuid>" }` — READ.
- `crisp.message.list` input: `{ "session_id": "session_<uuid>" }` — READ.
- Expected output envelope: `{ "provider": "crisp", "untrusted_data": true, "result": ... }`.

## Reply to a customer
- `crisp.message.send` input: `{ "session_id": "session_<uuid>", "content": "Thanks — we are investigating.", "approved": true }`.
- Permission: `website:conversation:messages` write for plugin tokens.
- Risk: HIGH_RISK because it sends an external message. Explicit human approval is always required.

## CRM update
- `crisp.people.update` input: `{ "people_id": "customer@example.com", "person": { "nickname": "Customer Name" }, "approved": true }`.
- Permission: `website:people:profiles` write. Risk: WRITE.

## Destructive removal
- `crisp.people.remove` additionally requires `CRISP_ENABLE_DESTRUCTIVE=true` and `approved:true`.
