# UpCloud MCP workflow examples

## Inspect infrastructure

Tool: `upcloud.server.list`

Input: `{}`

Expected output shape: JSON text containing `servers.server[]`.

Permission: `READ`. Approval: no.

## Inspect a server

Tool: `upcloud.server.get`

Input: `{ "uuid": "00e8051f-86af-468b-b932-4fe4ac6c7f08" }`

Expected output shape: JSON text containing `server` metadata.

Permission: `READ`. Approval: no.

## Restart a server

Tool: `upcloud.server.restart`

Input: `{ "uuid": "00e8051f-86af-468b-b932-4fe4ac6c7f08", "approval": true }`

Expected output shape: UpCloud restart response.

Permission: `HIGH_RISK`. Approval: explicit human approval and `UPCLOUD_ALLOW_HIGH_RISK=true`.

## Delete a server

Tool: `upcloud.server.delete`

Input: `{ "uuid": "00e8051f-86af-468b-b932-4fe4ac6c7f08", "approval": true }`

Expected output shape: UpCloud delete response.

Permission: `DESTRUCTIVE`. Approval: strong explicit human approval and `UPCLOUD_ALLOW_DESTRUCTIVE=true`.
