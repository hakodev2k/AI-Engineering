# Trigger.dev connector examples

## Inspect recent runs
Tool: `trigger-dev.run.list`
Input: `{ "limit": 20, "status": ["FAILED", "EXECUTING"] }`
Permission: READ. Approval: no.
Output shape: Trigger.dev runs page with `data` and pagination metadata.

## Trigger one task
Tool: `trigger-dev.task.trigger`
Input: `{ "task": "generate-report", "payload": { "customerId": "cust_123" }, "options": { "idempotencyKey": "report-cust-123-2026-09-08" }, "approved": true }`
Permission: WRITE. Approval: required unless writes are enabled by policy.
Output shape: `{ "id": "run_..." }`.

## Batch trigger
Tool: `trigger-dev.task.batch_trigger`
Input: `{ "task": "sync-record", "items": [{ "payload": { "id": "a" } }, { "payload": { "id": "b" } }], "approved": true }`
Permission: WRITE. Approval: required unless writes are enabled by policy.
Output shape: `{ "batchId": "batch_...", "runs": ["run_..."] }`.

## Diagnose a batch
Call `trigger-dev.batch.get`, then `trigger-dev.batch.results`. Both are READ and require no approval.

## Cancel an in-progress run
Tool: `trigger-dev.run.cancel`
Input: `{ "runId": "run_abc123", "approved": true }`
Permission: HIGH_RISK. Approval: always explicit and `TRIGGER_ALLOW_HIGH_RISK=true` must also be configured.

## Replay a failed run
Tool: `trigger-dev.run.replay`
Input: `{ "runId": "run_abc123", "approved": true }`
Permission: HIGH_RISK because replay creates a new execution with the original payload.
