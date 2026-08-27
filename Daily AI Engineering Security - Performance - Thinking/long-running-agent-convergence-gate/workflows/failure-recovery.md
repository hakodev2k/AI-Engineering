# Workflow: Non-Convergence Failure Recovery

## Trigger
`convergence_guard.py` returns a stop decision.

## Goal
Preserve useful work and end the runaway loop without weakening quality or safety.

## Inputs
Current ledger, task-owned diff or artifacts, branch state, guard reasons.

## Stages
1. Stop spawning agents and new work.
2. Capture current immutable references where available: commit SHA, artifact hashes, test result IDs.
3. Preserve task-owned changes in a safe snapshot or draft location; do not deploy.
4. Record exact failed criteria and guard reason codes.
5. Run a final non-destructive test and status capture.
6. Hand off for human or fresh-thread review.

## Retry policy
No autonomous retry of the failed loop. One snapshot retry is allowed if the first snapshot operation fails transiently.

## Stop conditions
Snapshot captured or snapshot cannot be safely captured.

## Failure path
If snapshot is unsafe or impossible, preserve read-only evidence and escalate.

## Verification
Convergence Reviewer confirms nothing new was added after the stop decision.

## Definition of Done
Current work is preserved or explicitly reported unpreservable; failure evidence is complete; autonomous expansion has stopped.
