# Workflow: Checkpoint → Resume → Recover

**Trigger:** imminent compaction or resumed compacted session.  
**Goal:** continue without repeating already-completed work.

## Inputs
Task acceptance criteria, checkpoint, post-compaction event stream.

## Baseline
Record current completed steps, progress token, verification state, and recent action signatures.

## Stages
1. Observe context pressure or compaction failure.
2. Write checkpoint.
3. Compact or hand off.
4. Resume by loading checkpoint.
5. Execute the next pending step.
6. Measure progress after each three-action window.
7. If no progress for one window, switch hypothesis or recovery tactic.
8. If no progress for two windows, stop autonomous execution and emit recovery packet.
9. Independent verification.

## Responsible agent
Task agent executes; Continuity Verifier verifies.

## Tools
Checkpoint schema, progress guard, git/status/test commands.

## Outputs
Updated checkpoint, event trace, guard decision, verification result.

## Checkpoints
Pre-compaction; first post-compaction action; each three-action window; final verification.

## Metrics
Repeated actions, progress-token deltas, completed-step deltas, new evidence IDs, reread rate.

## Retry policy
One recovery tactic after the first no-progress window. Maximum two no-progress windows.

## Stop conditions
Two no-progress windows, checkpoint contradiction, or dangerous recovery action without approval.

## Failure path
Stop and hand off the checkpoint plus last evidence; do not rescan indefinitely.

## Verification
Continuity Verifier must reproduce the stop/continue decision independently.

## Definition of Done
Task advances beyond checkpoint, required verification passes, and no bounded-loop rule is violated.
