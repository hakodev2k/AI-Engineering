# Replay and Reprocessing
## Purpose
Make historical replay safe, reproducible, and non-destructive.
## Scope
Backfills, replays, reprocessing, and correction jobs.
## MUST
- Replay procedures MUST define source range, code/config version, sink behavior, idempotency, and validation criteria.
- Reprocessing MUST isolate or safely reconcile outputs with live processing.
- High-impact production replays MUST require human approval.
## MUST NOT
- Historical events MUST NOT be replayed into side-effecting sinks without duplicate and external-effect controls.
## SHOULD
- Replay tooling SHOULD support dry-run or shadow output comparison.
## Exceptions
Emergency correction requires documented blast radius, rollback, and owner approval.
## Verification
Replay a bounded representative range in non-production or isolated output and reconcile counts, state, and side effects.