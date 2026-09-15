# Workflow examples

## Audience inspection
Tool: `kit.subscriber.list`
Input: `{ "perPage": 50, "include": ["tags"] }`
Permission: READ. Approval: no.
Expected output: upstream Kit MCP subscriber page wrapped as MCP text JSON.

## Draft a broadcast
Tool: `kit.broadcast.create`
Input: `{ "subject": "Weekly update", "content": "<p>Hello!</p>", "approved": true, "approvalToken": "human-confirmation" }`
Permission: WRITE. Approval: configurable; required by default.
Expected output: Kit MCP draft-broadcast result. This connector intentionally exposes no send/schedule tool.

## Unsubscribe
Tool: `kit.subscriber.unsubscribe`
Input: `{ "subscriberId": 123, "approved": true, "approvalToken": "human-confirmation" }`
Permission: DESTRUCTIVE. Approval: always required.
Expected output: Kit MCP unsubscribe result or Kit confirmation/deep-link response when Kit requires in-app confirmation.
