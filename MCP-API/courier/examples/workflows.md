# Workflow examples

## Diagnose a failed delivery

1. `courier.message.list` — find the relevant delivery record. Permission: READ. Approval: no.
2. `courier.message.get` — inspect status/provider metadata. Permission: READ. Approval: no.
3. `courier.message.history.get` — inspect the delivery trace. Permission: READ. Approval: no.
4. `courier.message.content.get` — inspect rendered content if needed. Permission: READ. Approval: no.

Expected output is the official Courier MCP result for each operation and may include message identifiers, delivery state, channel/provider information, rendered content, and history events.

## Prepare and send a user notification

1. `courier.user.profile.get` — verify recipient reachability. Permission: READ. Approval: no.
2. `courier.user.preferences.get` — verify preference state. Permission: READ. Approval: no.
3. `courier.notification.get` — inspect the intended template. Permission: READ. Approval: no.
4. `courier.message.send` — send only after an operator approves the exact recipient/content/template. Permission: HIGH_RISK. Approval: required.

Write calls additionally require `COURIER_ALLOW_WRITE=true`. Approval input shape:

```json
{
  "approval": {
    "confirmed": true,
    "reason": "Operator approved this exact recipient and notification"
  }
}
```
