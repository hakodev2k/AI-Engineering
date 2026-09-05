# Workflow: Checkpoint / Resume Recovery

## Trigger
Integrity gate failure, interrupted tool-heavy turn, or repeated resume error involving missing/orphaned tool output.

## Goal
Restore a structurally valid, evidence-preserving session and determine whether safe task continuation is possible.

## Inputs
Original transcript, logs, tool side-effect metadata, task acceptance criteria.

## Baseline
Run validator and record counts of calls, terminal events, unresolved IDs, orphan terminals, duplicate IDs, and prior recovery attempts.

## Context
Use observable persisted events and external evidence only. Hidden reasoning is neither requested nor required.

## Stages
1. **Observe:** capture exact validation/runtime error and immutable transcript copy.
2. **Measure baseline:** run `validate`.
3. **Diagnose:** classify each bad ID and identify failure window (interrupt, persistence, replay, restart, compaction).
4. **Form hypothesis:** state the minimal repair and whether replay is safe.
5. **Implement improvement:** create a repaired copy; unresolved calls without results become explicit cancellations only.
6. **Measure again:** validate repaired copy and compare event counts.
7. **Improved?** If invalid, re-evaluate once; maximum 2 recovery cycles.
8. **Resume:** one controlled continuation attempt with monitoring.
9. **Verify:** independent Recovery Verifier checks transcript and task evidence.

## Responsible agent
Recovery engineer for stages 1-8; Recovery Verifier for stage 9.

## Tools
`transcript_guard.py`, read-only logs, diff tool, runtime-specific safe resume command.

## Outputs
Baseline, root-cause hypothesis, repaired copy, before/after metrics, replay decision, resume evidence, reviewer result.

## Checkpoints
No re-execution of unknown non-idempotent side effects. Any fabricated result blocks completion.

## Metrics
Unresolved IDs; invalid events; repeated resume failures; duplicated tool executions; recovery cycles; acceptance criteria verified.

## Retry policy
Maximum 2 recovery cycles and 1 controlled resume per cycle.

## Stop conditions
Stop after second failed cycle, on unknown dangerous side effects, or if repair would require inventing output.

## Failure path
Keep original transcript, stop automatic continuation, capture diagnostics, escalate to runtime owner/human operator.

## Verification
Validator pass + bounded resume evidence + independent task verification.

## Definition of Done
Implemented repair (if needed), measured before/after integrity, verified no unsupported success/duplicate side effect, and task is either safely resumed or explicitly stopped.