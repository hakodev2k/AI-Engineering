# Pre-Run Admission Gate Hook

## Trigger
Immediately before an API, scheduler, queue consumer, parent agent, or orchestration layer acknowledges asynchronous work as accepted.

## Preconditions
The host has a stable run ID, idempotency key, sanitized input hash, and side-effect classification. The SQLite path or equivalent production ledger must be on durable storage appropriate to the deployment.

## Action
1. Persist the admission before acknowledgement:
   `python3 scripts/admission_ledger.py --db "$LEDGER_DB" admit --run-id "$RUN_ID" --idempotency-key "$IDEMPOTENCY_KEY" --input-hash "$INPUT_HASH"`
2. Add `--side-effect-free` only when the complete run is proven free of external side effects.
3. Acknowledge the caller only if the command exits `0`.
4. When the workflow runtime produces its first resumable checkpoint, run:
   `python3 scripts/admission_ledger.py --db "$LEDGER_DB" checkpoint --run-id "$RUN_ID" --checkpoint-id "$CHECKPOINT_ID"`
5. Periodically reconcile stale admissions using the measured timeout:
   `python3 scripts/admission_ledger.py --db "$LEDGER_DB" reconcile --lost-after-seconds 120`

## Expected result
Every acknowledged asynchronous run has a durable `accepted` row. A first checkpoint transitions it to `checkpointed`. Reconciliation surfaces stale uncheckpointed runs as `lost` with non-zero exit status.

## Failure behavior
Admission persistence failure MUST prevent acknowledgement. Idempotency conflicts MUST block the new run. A `lost` reconciliation result MUST trigger recovery classification; it MUST NOT automatically replay side-effecting work.

## Blocking
Yes. Admission storage failure, identifier conflict, or an unresolved lost side-effecting run blocks automatic continuation/replay.
