# Workflow: Regression Verification

## Trigger
Changes to verification tracking, completion gates, test harness handling, or workspace-state logic.

## Goal
Prove that fresh evidence stays fresh until the verified snapshot changes and that stale evidence is invalidated exactly once.

## Inputs
Policy, guard script, unit tests, current implementation diff.

## Baseline
Known cases: fresh pass, changed snapshot, epoch regression, expired evidence, uncaptured dirty diff.

## Stages
1. Run `python -m unittest tests/test_verification_epoch_guard.py`.
2. Verify fresh snapshot returns `fresh` without another test run.
3. Verify changed snapshot returns `reverify`.
4. Verify a new passing run advances the epoch and clears staleness.
5. Verify committed historical edits do not trigger current-dirty logic.
6. Verify temporary harness cleanup does not alter the bound code snapshot.

## Responsible agent
Verification Reviewer.

## Tools
Unit tests, Git state, deterministic guard.

## Outputs
Pass/fail record plus before/after rerun count.

## Checkpoints
Before and after any corrective change.

## Metrics
False stale rate, stale-green escape rate, reruns per unchanged snapshot.

## Retry policy
One corrective implementation change and one complete rerun.

## Stop conditions
Any stale-green escape blocks completion; repeated stale false-positive after the retry is escalated.

## Failure path
Do not relax snapshot matching or verification scope.

## Verification
Reviewer must be separate from the implementing agent for high-impact changes.

## Definition of Done
All deterministic tests pass and unchanged snapshots require zero redundant verification reruns.
