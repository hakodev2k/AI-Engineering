# Skill: Resume and Verify a Backfill

## Purpose
Resume an interrupted backfill without replaying completed work, skipping records, or trusting stale checkpoint assumptions.

## Inputs
Current plan, checkpoint, policy, current transform fingerprint, current source/predicate assumptions, prior chunk evidence, reviewer record.

## Procedure
1. Reload plan and checkpoint from durable storage; never infer cursor from chat memory.
2. Recompute/confirm transformation fingerprint and plan fingerprint.
3. Validate checkpoint identity/version/counters with `validate-backfill-state.py`.
4. Confirm no live lease belongs to another worker.
5. Compare current predicate/order/source semantics with the plan. Any approval-visible change requires a new revision.
6. Run `evaluate-resume-gate.py` immediately before work.
7. Fetch at most one configured chunk after the durable cursor using stable ordering.
8. Apply idempotent writes. For transient tool/connection failure, retry the same chunk at most policy limit; preserve first error and idempotency key.
9. Verify chunk writes before advancing checkpoint.
10. Advance checkpoint atomically using expected checkpoint version. A version conflict means another actor advanced state; stop and reload.
11. Repeat only while an external orchestrator invokes the next bounded iteration; do not create an unbounded autonomous loop.
12. At end, run final counts/invariants and independent review before marking completed.

## Failure classes
- Transient network/deadlock/rate limit: max 2 retries per chunk by default.
- Validation/fingerprint/version conflict: no automatic retry.
- Business invariant failure: pause and escalate.
- Permission failure: stop; never increase privileges silently.
- Unknown write outcome: verify destination by idempotency key before retry.

## Output
Updated checkpoint, per-chunk evidence, final verification report.

## Stop conditions
Checkpoint conflict, changed plan fingerprint, failed invariant, exhausted retry budget, missing approval, active foreign lease, or ambiguous write outcome not resolvable by read-back.
