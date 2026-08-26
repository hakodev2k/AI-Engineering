# Workflow: Compaction Failure Recovery

## Trigger
Compaction is deferred, rejected for insufficient reduction, interrupted, or fails for the same transcript digest.

## Goal
Recover without deleting source history, duplicating side effects, or retrying indefinitely.

## Inputs
Failure reason, history digest, retry count, source checkpoint, tool-call ledger, current-context measurement.

## Baseline
Preserve the pre-failure transcript and record whether any tool is `issued` or `unknown`.

## Stages
1. Detect and persist the failure reason without copying large failed summaries back into active context.
2. If a side effect is unresolved, reconcile its durable external state before any retry.
3. If token scope was wrong, re-measure from current materialized context.
4. If candidate would grow or reduce too little, change strategy once (for example, compact older read-only evidence while preserving active tail).
5. Re-run the guard and verification.

## Retry policy
At most 2 attempts per unchanged history digest.

## Maximum retries
2.

## Fallback
Keep the original transcript; disable automatic compaction for that digest and surface a blocking context-pressure state.

## Escalation
Require human/operator intervention before irreversible transcript deletion or uncertain side-effect replay.

## Stop condition
Stop on exhausted retries, missing checkpoint, unknown external side-effect state, or inability to fit a safe next turn.

## Definition of Done
Failure is explicit, source history is durable, side effects are reconciled, retries are bounded, and no safety/accuracy control was weakened.
