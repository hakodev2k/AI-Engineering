# Discord MCP Tool Examples

## Read a channel

Tool: `discord.channel.get`

```json
{ "channel_id": "123456789012345678" }
```

Risk: `READ`. Approval: no.

## Send a message

Tool: `discord.message.send`

```json
{
  "channel_id": "123456789012345678",
  "content": "Deployment completed successfully.",
  "approval_id": "approved-send-20260821"
}
```

Risk: `WRITE`. Approval: yes. The approval id must be provisioned out-of-band in `DISCORD_APPROVED_ACTION_IDS`.

## Delete a message

Tool: `discord.message.delete`

```json
{
  "channel_id": "123456789012345678",
  "message_id": "123456789012345679",
  "approval_id": "approved-delete-20260821"
}
```

Risk: `DESTRUCTIVE`. Approval: yes.

Expected successful output is the Discord API JSON response serialized as MCP text content; endpoints that return no body yield `null`.
