# Model Validation and Promotion

## Purpose
Create evidence-based gates that decide whether a candidate model is safe and valuable enough to advance toward production.

## When to use
Use before registry promotion, deployment, major data changes, or retraining replacement.

## Inputs
Candidate and baseline models, evaluation datasets, business metrics, slice definitions, latency/resource constraints, risk thresholds.

## Preconditions
Evaluation sets and acceptance criteria are defined before reviewing results.

## Context to inspect
Metric implementation, dataset lineage, leakage risks, prior production performance, fairness/safety requirements, and serving constraints.

## Core knowledge
Aggregate accuracy is insufficient. Promotion should cover statistical quality, critical slices, calibration where relevant, operational characteristics, regressions, and uncertainty.

## Procedure
1. Verify evaluation dataset lineage and independence.
2. Compare against current production baseline.
3. Evaluate primary and guardrail metrics.
4. Inspect critical cohorts and failure slices.
5. Test robustness to representative perturbations.
6. Measure latency, memory, throughput, and artifact size.
7. Check compatibility and schema contracts.
8. Record uncertainty and statistically meaningful deltas.
9. Apply automated gates plus required human approvals.
10. Attach evidence to the registry version.

## Decision points
Absolute threshold vs non-inferiority; global vs slice-specific gates; offline approval vs online experiment requirement.

## Common failure patterns
Tuning on the test set, metric cherry-picking, ignored regressions in minority slices, unverifiable benchmark code, and promoting an operationally unaffordable model.

## Verification
Re-run validation from immutable artifacts and reproduce the promotion decision.

## Expected output
Validation report, pass/fail gates, regression list, operational benchmark, and approval record.

## Stop conditions
Stop on leakage, invalid evaluation data, unresolved critical-slice regression, or missing safety/compliance approval.