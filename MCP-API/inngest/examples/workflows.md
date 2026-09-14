# Inngest connector workflows

Provider responses are always marked as untrusted data by the MCP server.

## Diagnose a failed run — READ, no approval
1. `inngest.run.list`: `{ "status": ["FAILED"], "limit": 10 }`
2. `inngest.run.get`: `{ "runId": "<run-id>", "includeOutput": true }`
3. `inngest.run.trace.get`: `{ "runId": "<run-id>", "includeOutput": true }`

Expected output envelope: `{ "ok": true, "data": ..., "untrustedProviderData": true }`.

## Send a test event — HIGH_RISK, explicit approval
Tool: `inngest.event.send`
```json
{ "name": "app/order.created", "data": { "orderId": "test-123" }, "approvalId": "<host-supplied-grant>" }
```
Sending an event can execute deployed functions and cause downstream side effects.

## Directly invoke a function — HIGH_RISK, explicit approval
Tool: `inngest.function.invoke`
```json
{ "appId": "billing", "functionId": "reconcile", "data": { "dryRun": true }, "idempotencyKey": "review-123", "approvalId": "<host-supplied-grant>" }
```

## Cancel a stuck run — HIGH_RISK, explicit approval
Tool: `inngest.run.cancel`
```json
{ "runId": "01JXXXXXXXXXXXX", "approvalId": "<host-supplied-grant>" }
```
