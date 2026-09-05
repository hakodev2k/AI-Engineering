# Workflow: Capture -> Compact -> Resume

## Trigger
Context manager decides compaction is required.

## Goal
Reduce context while preserving task lifecycle state.

## Inputs
Active task state, acceptance criteria, evidence IDs, pending handles, transcript.

## Baseline
Record pre-compaction task status, pending criteria count, progress marker, and active external handles.

## Context
This workflow stores observable execution state only.

## Stages
1. Observe current task state.
2. Capture checkpoint atomically.
3. Validate checkpoint; block compaction on failure.
4. Perform normal transcript compaction.
5. Reload checkpoint from durable state.
6. Validate again.
7. If `status=in_progress` and pending work exists, resume that work.
8. Measure post-resume progress.
9. Verify completion only against acceptance criteria.

## Responsible agent
Runtime/implementation agent; final verification by Continuity Verifier.

## Tools
Checkpoint store, compactor, `validate_checkpoint.py`, normal task tools.

## Outputs
Pre/post checkpoint, compaction result, resume event, completion evidence.

## Checkpoints
Before compaction and immediately after restore.

## Metrics
Checkpoint validation pass rate; resume latency; false-success rate; lost handles; completion rate.

## Retry policy
At most 2 restore/resume attempts.

## Stop conditions
Validator failure after 2 attempts; missing unreconstructable goal/criteria; dangerous action lacking approval.

## Failure path
Emit BLOCKED with evidence and escalate. Never convert to success.

## Verification
Independent replay of autonomous and completed-task fixtures.

## Definition of Done
Goal continuity preserved, unfinished work resumes, completion evidence verified.