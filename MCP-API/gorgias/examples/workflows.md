# Gorgias connector workflows

## Triage a customer issue

1. `gorgias.customer.list`
   - Input: `{ "email": "customer@example.com" }`
   - Permission: READ
   - Approval: none
   - Output: matching Gorgias customer records.
2. `gorgias.ticket.list`
   - Input: `{ "customerId": 123, "limit": 30 }`
   - Permission: READ
   - Approval: none
   - Output: recent tickets for that customer.
3. `gorgias.ticket.get`
   - Input: `{ "ticketId": 456 }`
   - Permission: READ
   - Approval: none
   - Output: complete ticket metadata returned by Gorgias.
4. `gorgias.message.internal_note.create`
   - Input: `{ "ticketId": 456, "senderEmail": "agent@example.com", "bodyText": "Investigating payment gateway logs." }`
   - Permission: WRITE
   - Approval: required by default.

## Prepare and send a customer reply

Use `gorgias.message.list` to review the thread first. Sending is deliberately separate from reading and preparation.

Tool: `gorgias.message.reply.send`

Input:

```json
{
  "ticketId": 456,
  "senderUserEmail": "agent@example.com",
  "fromAddress": "support@example.com",
  "toAddress": "customer@example.com",
  "bodyText": "Your replacement has shipped.",
  "subject": "Re: Replacement order"
}
```

Permission: HIGH_RISK.

Approval: always requires the exact action fingerprint `gorgias.message.reply.send:456:customer@example.com` in `GORGIAS_APPROVED_ACTIONS`. `fromAddress` must correspond to an existing Gorgias email integration for delivery to succeed.

## Create an inbound API ticket

Tool: `gorgias.ticket.create`

Input:

```json
{
  "customerEmail": "customer@example.com",
  "subject": "API-imported customer request",
  "bodyText": "I need help changing my shipping address.",
  "priority": "normal"
}
```

Permission: WRITE.

Approval: required by default. The tool creates an incoming API-channel message (`from_agent=false`) and therefore does not send an outbound customer message.
