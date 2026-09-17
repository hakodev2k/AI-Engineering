# Slack workflow examples

`slack.conversation.list` with `{ "types": "public_channel", "limit": 50 }` returns Slack's conversation collection and pagination metadata. Permission: READ. Approval: no.

`slack.conversation.history` with `{ "channel": "C123", "limit": 50 }` returns messages plus `response_metadata.next_cursor`. Permission: READ. Approval: no.

`slack.thread.read` with `{ "channel": "C123", "ts": "1750000000.000001" }` returns the parent and replies. Permission: READ. Approval: no.

`slack.message.send` with `{ "channel": "C123", "text": "Deployment complete", "approval": "<runtime approval secret>" }` returns the created message timestamp. Permission: WRITE. Approval: yes.

`slack.message.delete` requires channel, timestamp and approval. Permission: DESTRUCTIVE. Approval: yes. The connector never supplies the approval value itself.
