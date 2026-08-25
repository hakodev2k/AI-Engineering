# Workflow: Differential Regression Investigation

## Trigger
A regression or persistent unexplained failure is reported.

## Goal
Isolate the smallest differing boundary before repair and verify the repair against both failing and passing cases.

## Inputs
Failing reproduction, ledger, test environment.

## Baseline
Measure failing-case reproducibility, tool/model calls, elapsed time, and known environment dimensions.

## Stages
1. Observe failing case and capture evidence.
2. Measure baseline reproducibility.
3. Search for a nearest passing control using a bounded candidate budget.
4. Compare manifests and record differences.
5. Form evidence-linked falsifiable hypotheses.
6. Run the highest-discrimination experiment.
7. Update evidence; reject/support hypotheses.
8. If not isolated, retry with a new experiment, maximum three total.
9. Run `--stage repair`; only a pass permits implementation.
10. Implement the smallest supported change.
11. Re-run failing case and matched control.
12. Independent reviewer checks final evidence; run `--stage verify`.

## Responsible agent
Investigator owns evidence; implementation agent owns repair; independent reviewer owns final evidence review.

## Tools
Tests, logs, safe version comparisons, read/search, bisect when feasible, ledger gate.

## Outputs
Investigation ledger, diagnosis decision, before/after results.

## Checkpoints
After control search; after each experiment; before repair; before completion.

## Metrics
Calls/time to control, experiment count, duplicate attempts, verification coverage, rework.

## Retry policy
At most three experiments. Retry only with a different discriminator or new evidence.

## Stop conditions
Budget exhausted, control invalidated, reproduction disappears, unsafe experiment, or contradictory evidence.

## Failure path
Preserve evidence, mark `INCONCLUSIVE`, and escalate scope rather than weakening verification.

## Definition of Done
Repair gate passed, target isolated, repair implemented, failing case passes, control remains passing, independent verification passes.