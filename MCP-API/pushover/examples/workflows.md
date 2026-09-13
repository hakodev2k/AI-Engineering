# Pushover workflow examples

## Validate a recipient

Tool: `pushover.user.validate`

```json
{"user":"YOUR_30_CHARACTER_USER_KEY"}
```

Risk: `READ`. Approval: no.

## Send a normal notification

Tool: `pushover.message.send`

```json
{
  "user":"YOUR_30_CHARACTER_USER_KEY",
  "title":"Build finished",
  "message":"Production artifact is ready for review.",
  "priority":0,
  "approval":"approved-high-risk"
}
```

Risk: `HIGH_RISK` because it sends an external notification. Requires `PUSHOVER_ALLOW_HIGH_RISK=true` and explicit `approved-high-risk` approval.

Expected shape:

```json
{"provider":"pushover","tool":"pushover.message.send","risk":"HIGH_RISK","untrusted_provider_content":true,"result":{"status":1,"request":"..."}}
```

## Emergency notification and acknowledgement

1. Call `pushover.message.send` with `priority: 2`, `retry >= 30`, `expire <= 10800`, and high-risk approval.
2. Store the returned receipt.
3. Poll `pushover.receipt.get` no faster than once every five seconds.
4. If the incident is resolved, call `pushover.receipt.cancel` with high-risk approval.

## Manage an on-call delivery group

Read tools `pushover.group.list` and `pushover.group.get` need no approval. Adding, enabling, creating, or renaming requires WRITE approval. Disabling a user is HIGH_RISK. Removing a member is DESTRUCTIVE, is disabled by default, and additionally requires `approved-destructive`.
