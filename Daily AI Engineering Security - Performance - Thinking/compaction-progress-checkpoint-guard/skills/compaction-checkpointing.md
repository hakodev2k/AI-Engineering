# Skill: Compaction Checkpointing

## Purpose
Preserve observable execution continuity across context compaction without persisting hidden chain-of-thought.

## Trigger
Before automatic/manual compaction, session handoff, or recovery from a compaction error.

## Inputs
Task goal, completed/pending steps, facts/evidence IDs, rejected hypotheses, verification status, repository/progress token.

## Preconditions
Current task state can be expressed as observable facts and artifacts.

## Required context
Acceptance criteria, current repository state, latest verification result.

## Allowed tools
Read-only git/status inspection, checkpoint serializer, progress guard.

## Constraints
MUST NOT request or store hidden chain-of-thought. MUST NOT store secrets. MUST distinguish facts from hypotheses.

## Procedure
1. Capture goal and acceptance criteria.
2. List completed steps with artifact/evidence references.
3. Record pending steps in execution order.
4. Record rejected hypotheses so they are not retried without new evidence.
5. Compute a non-secret progress token from observable repository/task state.
6. Record verification status and next action.
7. After compaction, load checkpoint before broad repository rereads.
8. Feed action signatures and progress deltas to the guard.
9. Recover after bounded no-progress detection.

## Decision points
A rejected hypothesis may only be reopened when new evidence is recorded. Broad rescans require evidence that checkpoint state is insufficient.

## Expected output
Structured checkpoint plus continuation/recovery decision.

## Metrics
Repeated-action rate, reread rate, completed-step delta, recovery frequency, verification coverage.

## Verification
Continuity Verifier checks checkpoint fields against observable artifacts and reruns loop fixtures.

## Failure handling
One checkpoint reconstruction attempt; then explicit recovery handoff.

## Stop conditions
Two no-progress windows, checkpoint inconsistency, missing acceptance criteria, or destructive action requiring human approval.
