# Workflow: Compact → Re-ground → Continue

**Trigger:** automatic/manual compaction or resume from a compacted session.  
**Goal:** resume execution from verified external state instead of summary-only memory.

## Inputs
Compaction summary, acceptance criteria, repository/task/test state, retry counters.

## Baseline
Capture pre-compaction acceptance criteria, active hypothesis, attempt count, and known external state when available.

## Context
Use explicit Facts, Assumptions, Claims, Evidence, Risks, Decision, and Verification status. Hidden chain-of-thought is neither requested nor stored.

## Stages
1. Observe the compaction boundary.
2. Extract externally checkable claims from the compacted state.
3. Mark claims critical when they affect writes, completion, permissions, tests, branches, deployments, or acceptance criteria.
4. Re-read current external state with read-only tools.
5. Attach evidence references and status to each critical claim.
6. Restore `attempt` and `max_attempts` for the active hypothesis.
7. Run `python scripts/checkpoint_verify.py checkpoint.json`.
8. If blocked, repair the evidence/state mismatch at most twice.
9. Require independent checkpoint verification before consequential continuation.

## Responsible agent
Implementation/planning agent performs re-grounding; `checkpoint-verifier` performs independent review.

## Tools
Read-only file/git/task inspection, deterministic tests, checkpoint verifier.

## Outputs
Verified checkpoint, contradiction list, retry state, decision to continue or stop.

## Checkpoints
Immediately after compaction and before any write, deploy, permission change, or destructive operation.

## Metrics
Critical verification coverage, contradictions caught, repeated-action count, failed-loop count, rework rate.

## Retry policy
Maximum 2 repair attempts for the same evidence/state mismatch.

## Stop conditions
Retry budget exhausted, critical contradiction unresolved, required evidence unavailable, or safety boundary unclear.

## Failure path
Stop consequential actions and surface the unresolved claim. Start a fresh session only with a verified handoff checkpoint.

## Verification
Independent verifier must confirm 100% critical-claim coverage and valid retry state.

## Definition of Done
All critical claims are freshly grounded, retry state is bounded, tests pass, and independent verification returns `pass`.
