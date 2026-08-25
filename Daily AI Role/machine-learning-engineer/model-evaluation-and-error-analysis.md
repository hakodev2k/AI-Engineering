# Model Evaluation and Error Analysis

## Purpose
Determine whether a model is genuinely useful and identify systematic failure modes that aggregate metrics hide.

## When to use
Use before promotion, after retraining, and when quality regressions are reported.

## Inputs
Predictions, labels, baseline, slices, costs, confidence scores and acceptance criteria.

## Context to inspect
Dataset construction, class balance, temporal periods, user segments and known edge cases.

## Core knowledge
Evaluation should combine aggregate metrics, uncertainty, calibration, slice analysis and qualitative error taxonomy. Statistical significance is not practical significance.

## Procedure
1. Reconfirm evaluation data isolation.
2. Compare against baseline and incumbent.
3. Compute primary and guardrail metrics with uncertainty intervals.
4. Evaluate calibration where probabilities drive decisions.
5. Break metrics down by meaningful slices and time.
6. Inspect confusion/error examples.
7. Create an error taxonomy and quantify categories.
8. Test robustness to missing/noisy/shifted inputs.
9. Translate metric changes into expected business impact.
10. Decide promote, iterate or reject against predeclared criteria.

## Decision points
Prioritize fixes for frequent, costly or safety-critical errors rather than rare cosmetic errors. Use threshold tuning only with explicit cost trade-offs.

## Common failure patterns
Single aggregate score, no confidence intervals, cherry-picked slices, threshold chosen on test data, ignoring calibration and qualitative failures.

## Verification
Independent recomputation of metrics, reproducible slices, reviewed error samples and documented acceptance decision.

## Expected output
Evaluation report with metrics, uncertainty, slices, error taxonomy and promotion recommendation.

## Stop conditions
Stop promotion if critical slices regress beyond guardrails or labels/evaluation integrity are suspect.