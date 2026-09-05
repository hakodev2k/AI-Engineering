# Workflow: Incomplete Batch Recovery

## Trigger
A batch has missing expected results or transport/result bookkeeping reports incomplete delivery.

## Goal
Recover without retry storms or duplicate side effects.

## Inputs
Batch ledger, tool statuses, idempotency metadata, current concurrency.

## Baseline
Capture expected IDs, received IDs, externally completed calls, and side-effect evidence before retrying.

## Stages
1. Stop model continuation using the incomplete batch.
2. Determine missing IDs and whether corresponding calls executed externally.
3. For read-only/idempotent work, retry missing safe calls once at reduced concurrency.
4. For uncertain mutating work, do not replay; request human/operator reconciliation.
5. If reduced-concurrency recovery is incomplete, force serial mode or stop.
6. Record incident metrics and trigger re-benchmark.

## Responsible agent
Runtime recovery controller; human approval for uncertain mutations.

## Tools
Ledger, execution logs, idempotency keys, trace analyzer.

## Outputs
Recovered results or explicit blocked state; incident evidence.

## Checkpoints
No replay without side-effect classification.

## Metrics
Recovery success, duplicate side effects, calls replayed, time-to-recovery.

## Retry policy
One reduced-concurrency retry only.

## Stop conditions
Second incomplete delivery; unknown mutation status; missing execution evidence.

## Failure path
Serial fallback if safe, otherwise escalate.

## Verification
Recovered ledger must exactly match expected IDs.

## Definition of Done
All expected results are reconciled or the task is explicitly stopped without hidden loss.