# Workflow: Regression Verification

## Trigger
Migration implementation reaches candidate-complete state.

## Goal
Prove both migration completeness and preserved behavior.

## Inputs
Migration report, policy, test suite, repository state.

## Baseline
Pre-migration test result and legacy-marker inventory.

## Stages
1. Re-run structural audit.
2. Re-run behavioral suite from a clean state.
3. Run independent targeted checks around migrated boundaries.
4. Build final report.
5. Execute acceptance guard.
6. Permit one evidence-correction rerun if the report itself was malformed.

## Checkpoints
Before tests, after structural audit, after independent checks.

## Metrics
Behavioral pass rate, residual legacy count, hidden-regression count.

## Retry policy
One evidence-correction rerun; implementation repairs return to the main workflow and count against its two-round limit.

## Stop conditions
Any regression, missing migration proof, verifier disagreement, or exhausted retry.

## Failure path
Block completion and preserve failing evidence.

## Verification
Verifier must be independent from implementer.

## Definition of Done
Guard accepts and all evidence is reproducible.
