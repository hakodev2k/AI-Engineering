# Workflow: Safe DLQ Replay

## Trigger
DLQ accumulation, replay request, replay-tooling change, or incident requiring selective reprocessing.

## Entry conditions
- repository is available;
- target environment and queue are identified;
- DLQ evidence is exported read-only;
- no queue mutation has started.

## Stages

### 1. Context discovery — DLQ Investigator
Map producer, consumer, schema, retry policy, DLQ path, side effects, idempotency controls, tenant boundaries, and relevant tests.

Checkpoint: do not continue without identifying the handler for candidate messages.

### 2. Failure classification — DLQ Investigator
Run deterministic analysis and classify messages as transient, permanent, unknown, or already-resolved.

Checkpoint: unknown and permanent classes are blocked by default.

### 3. Replay plan — Replay Implementation Agent
Create an exact JSON plan with explicit IDs, batch size, environment, queue, reason, failure classification, idempotency evidence, and approval fields. Validate it before execution.

Checkpoint: plan hash is frozen after validation.

### 4. Approval
Human approval is required for production, stale-message exceptions, weak idempotency evidence, or configured limit exceptions.

Checkpoint: stop if required approval is absent.

### 5. Execution — Replay Implementation Agent
Execute only the validated IDs using repository/provider-specific tooling. Record every attempted ID and receipt. Stop immediately on scope drift or ambiguous provider response.

### 6. Post-replay checks — Verification Agent
Compare execution to plan, verify downstream processing, check duplicate side effects, and inspect residual DLQ state.

### 7. Final evidence — Verification Agent
Create evidence matching `schemas/replay-evidence.schema.json` and run `scripts/verify-replay-evidence.py`.

## Retry rules
- Investigation/tool read failure: at most 1 retry when clearly transient.
- Plan validation failure: at most 2 plan revisions, preserving each failed validator result.
- Code/test failure: at most 2 implementation corrections.
- Replay execution: no automatic retry. Unknown outcome requires reconciliation.
- Verification evidence formatting: 1 correction allowed; factual evidence may not be rewritten to force success.

## Failure paths
- Permission failure → stop; do not escalate privileges.
- Unknown message outcome → reconciliation-required.
- Unexpected duplicate side effect → failed; stop further replay.
- Queue/provider unavailable before execution → stop with plan preserved.
- Queue/provider unavailable after an attempt → reconcile receipts before any further attempt.
- Business-rule rejection → classify permanent unless authoritative evidence shows otherwise.

## Produced artifacts
Investigation findings, validated replay plan, plan hash, execution receipts, post-replay evidence, final verification status.

## Definition of Done
All selected messages are classified, scope is bounded, required approvals exist, execution matches the plan, every attempt has a known reconciled outcome, downstream effects are checked, and independent verification succeeds.
