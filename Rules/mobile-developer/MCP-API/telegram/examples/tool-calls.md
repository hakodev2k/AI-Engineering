# Telegram MCP tool examples

## Read bot identity

Tool: `telegram.bot.get`

Input:
```json
{}
```
Permission: `READ`  
Approval: No

Expected output shape: Telegram `User` object wrapped as MCP text JSON.

## Read chat

Tool: `telegram.chat.get`

Input:
```json
{ "chat_id": "-1001234567890" }
```
Permission: `READ`  
Approval: No

## Send message

Tool: `telegram.message.send`

Input:
```json
{
  "chat_id": "-1001234567890",
  "text": "Deployment completed successfully.",
  "approval_id": "approval-issued-out-of-band"
}
```
Permission: `WRITE`  
Approval: Required

Expected output shape: Telegram `Message` object.

## Delete message

Tool: `telegram.message.delete`

Input:
```json
{
  "chat_id": "-1001234567890",
  "message_id": 42,
  "approval_id": "approval-issued-out-of-band"
}
```
Permission: `DESTRUCTIVE`  
Approval: Required

Expected output shape: `true` when Telegram accepts the deletion.

Never place the bot token in MCP tool inputs.
