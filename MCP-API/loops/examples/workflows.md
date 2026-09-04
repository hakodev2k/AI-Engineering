# Example tool calls

## Read a contact

Tool: `loops.contact.find`

```json
{ "email": "user@example.com" }
```

Permission: READ. Approval: no.

## Trigger a lifecycle event

Tool: `loops.event.send`

```json
{
  "eventName": "trial_started",
  "userId": "user_123",
  "eventProperties": { "plan": "pro" },
  "idempotencyKey": "trial_started:user_123:2026-09-04",
  "approval": { "confirmed": true, "reason": "Operator approved the lifecycle event" }
}
```

Permission: HIGH_RISK. Approval: yes because a published workflow may send external email.

## Send transactional email

Tool: `loops.transactional_email.send`

```json
{
  "transactionalId": "11111111-1111-4111-8111-111111111111",
  "email": "user@example.com",
  "dataVariables": { "resetUrl": "https://example.com/reset/token" },
  "idempotencyKey": "password-reset:request-123",
  "approval": { "confirmed": true, "reason": "User requested a password reset email" }
}
```

Permission: HIGH_RISK. Approval: yes.
