# Workflow: Discovery to Approval Integrity

## Trigger
Tool discovery or refresh.

## Goal
Preserve advisory annotations without permitting silent risk downgrade.

## Inputs
Tool metadata and policy.

## Baseline
Measure annotation preservation and approval decisions before change.

## Stages
1. Observe raw metadata.
2. Normalize fields.
3. Compare against prior snapshot.
4. Classify conservatively.
5. Evaluate host policy.
6. Independently review high-risk or changed tools.
7. Record decision evidence.

## Checkpoints
After normalization, after drift comparison, before approval decision.

## Metrics
Preservation rate, unknown rate, read-only prompt rate, downgrade count.

## Retry policy
At most 2 metadata refreshes for transient discovery inconsistency.

## Stop conditions
Stop on malformed metadata, unresolved identity, contradictory annotations, or repeated drift.

## Failure path
Require approval or disable the tool; never infer safety from absence.

## Verification
Run unit tests and compare recorded raw/canonical snapshots.

## Definition of Done
No blocking finding remains and the reviewer confirms fail-closed behavior.