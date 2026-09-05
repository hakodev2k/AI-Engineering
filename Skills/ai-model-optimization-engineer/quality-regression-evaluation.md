# Quality Regression Evaluation

## Purpose
Ensure performance optimizations do not introduce unacceptable model-quality, safety, or calibration regressions.

## When to use
After precision, compilation, pruning, distillation, decoding, context, runtime, or hardware changes.

## Inputs
Reference model, candidate artifact, evaluation datasets, critical slices, metrics, acceptance thresholds.

## Preconditions
Version datasets and prevent contamination between tuning and final evaluation.

## Context to inspect
Inspect task metrics, safety requirements, rare/critical cohorts, long inputs, numerical tolerances, stochastic decoding, and known failure cases.

## Core knowledge
Aggregate scores can hide severe slice regressions. Statistical noise and nondeterminism require repeated or paired comparisons. Optimization acceptance is multi-objective.

## Procedure
1. Define primary and guardrail metrics before testing.
2. Run reference and candidate under equivalent conditions.
3. Use paired examples where possible.
4. Compare aggregate quality and critical slices.
5. Inspect changed outputs and failure clusters.
6. Repeat stochastic evaluations enough to estimate variance.
7. Test boundary shapes and long contexts.
8. Include safety/policy tests where applicable.
9. Record confidence and practical significance.
10. Gate deployment on explicit thresholds.

## Decision points
Accept small global regression only when predefined business/SLO trade-offs permit it and no critical slice crosses a hard gate.

## Common failure patterns
Tuning on the test set, single-run stochastic comparisons, aggregate-only reporting, changing prompts/config between candidates, and post-hoc thresholds.

## Verification
Independent rerun reproduces the comparison and all hard quality/safety gates pass.

## Expected output
Reference-vs-candidate evaluation report, slice analysis, changed-case evidence, and accept/reject decision.

## Stop conditions
Stop if evaluation data is contaminated, metrics do not represent the task, or a hard safety/quality gate fails pending review.