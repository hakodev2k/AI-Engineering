# Slack MCP Connector Examples

## Read a channel

Tool: `slack.channel.history`

```json
{
  "channelId": "C0123456789",
  "limit": 25
}
```

Permission: `READ`  
Approval: No

Expected output: Slack `conversations.history` response serialized as JSON, including messages and pagination metadata when supplied by Slack.

## Search messages

Tool: `slack.message.search`

```json
{
  "query": "deployment after:2026-08-01",
  "count": 20,
  "page": 1,
  "sort": "timestamp",
  "sortDir": "desc"
}
```

Permission: `READ`  
Approval: No  
Credential: `SLACK_USER_TOKEN` with the Slack permission required for message search.

## Send an approved message

Tool: `slack.message.send`

```json
{
  "channelId": "C0123456789",
  "text": "Deployment completed successfully.",
  "approved": true
}
```

Permission: `WRITE`  
Approval: Required by default

Expected output: Slack `chat.postMessage` response serialized as JSON.

## Reply in a thread

Tool: `slack.message.send`

```json
{
  "channelId": "C0123456789",
  "threadTs": "1755777600.123456",
  "text": "I checked the logs and the service is healthy.",
  "approved": true
}
```

Permission: `WRITE`  
Approval: Required by default

## Add a reaction

Tool: `slack.reaction.add`

```json
{
  "channelId": "C0123456789",
  "timestamp": "1755777600.123456",
  "emoji": "white_check_mark",
  "approved": true
}
```

Permission: `WRITE`  
Approval: Required by default
