# Workflow: Regression Verification

## Trigger
Any change to sandbox, permissions, path parsing, attachment preprocessing, edit/write tools, or workspace roots.

## Goal
Detect reintroduction of outside-workspace access before release.

## Inputs
Current policy, deterministic gate, test fixtures, implementation diff.

## Baseline
A known-good release or the last verified fixture matrix.

## Stages
1. Run unit tests.
2. Exercise direct relative/absolute paths.
3. Exercise parent traversal.
4. Exercise symlink escape and nonexistent target.
5. Exercise denied prefixes.
6. Confirm each supported access syntax reaches the same gate.
7. Compare with baseline and investigate any changed decision.

## Outputs
Test results, changed-decision list, verifier pass/block decision.

## Checkpoints
After deterministic tests and before release approval.

## Metrics
Fixture pass rate must be 100%; escape acceptance must be 0; fail-open resolution count must be 0.

## Retry policy
One corrective change and one full rerun; otherwise escalate.

## Stop conditions
Any outside-root access, secret exposure, or unexplained policy divergence blocks completion.

## Failure path
Revert/disable affected access mode and escalate to security owner.

## Verification
Verifier must be independent of the implementation change.

## Definition of Done
All tests and integration fixtures pass with unchanged or stricter security boundaries.
