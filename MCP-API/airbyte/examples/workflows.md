# Airbyte connector examples

## Inspect connections
Tool: `airbyte.connection.list` — READ — no approval.
```json
{"workspaceIds":["871d9b60-11d1-44cb-8c92-c246d53bf87e"],"limit":20,"offset":0}
```

## Inspect available streams
Tool: `airbyte.stream.list` — READ — no approval.
```json
{"sourceId":"18dccc91-0ab1-4f72-9ed7-0b8fc27c5826","ignoreCache":false}
```

## Trigger a sync
Tool: `airbyte.job.sync` — WRITE — explicit approval required.
```json
{"connectionId":"18dccc91-0ab1-4f72-9ed7-0b8fc27c5826","approval_token":"<payload-bound HMAC-SHA256>"}
```

## Reset a connection
Tool: `airbyte.job.reset` — HIGH_RISK — explicit approval required because a reset can re-read and rewrite destination data.
```json
{"connectionId":"18dccc91-0ab1-4f72-9ed7-0b8fc27c5826","approval_token":"<payload-bound HMAC-SHA256>"}
```

## Cancel a running job
Tool: `airbyte.job.cancel` — HIGH_RISK — explicit approval required.
```json
{"jobId":12345,"approval_token":"<payload-bound HMAC-SHA256>"}
```
