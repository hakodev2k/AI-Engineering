# Evaluation and Error Analysis

## Purpose
Build evaluation that explains whether a vision system is fit for production, where it fails, and which intervention is likely to improve it.

## When to use
Use before releases, after model changes, during regressions, or whenever aggregate metrics hide operationally important behavior.

## Inputs
Held-out data, production slices, predictions, ground truth, thresholds, baseline models, and error-cost definitions.

## Preconditions
Evaluation data is isolated from model selection and reflects the intended deployment boundary.

## Context to inspect
Inspect split construction, leakage, prevalence, class/device/location/time slices, annotation uncertainty, confidence distribution, and downstream thresholds.

## Core knowledge
A useful evaluation combines task metrics, calibration, slice analysis, confidence/threshold curves, qualitative review, statistical uncertainty, and comparison against baselines. Metric choice must reflect the task and decision cost.

## Procedure
1. Confirm test-set isolation and split rationale.
2. Select primary and guardrail metrics tied to user impact.
3. Compute class and condition slices before looking only at aggregate scores.
4. Generate confusion/error taxonomies.
5. Review representative false positives, false negatives, and localization errors visually.
6. Plot performance versus confidence, threshold, object size, image quality, and other relevant covariates.
7. Quantify uncertainty using repeated runs or confidence intervals where practical.
8. Compare against the current production model and simple baseline.
9. Separate model, label, data-pipeline, and product-definition failures.
10. Rank error categories by frequency and operational cost.
11. Convert high-value failures into targeted experiments and regression cases.
12. Freeze final test results for release evidence.

## Decision points
Prefer slice-specific thresholds only when operational complexity and fairness implications are acceptable. Treat annotation disagreement separately from unequivocal model errors.

## Common failure patterns
Repeatedly tuning on the test set, cherry-picking qualitative examples, comparing runs with changed data, ignoring confidence calibration, and declaring improvement from statistically noisy differences.

## Verification
Verify reproducible metrics, test-set isolation, baseline comparison, critical-slice acceptance, and traceable examples supporting the error taxonomy.

## Expected output
A release-quality evaluation report with metrics, uncertainty, ranked errors, visual evidence, and recommended next actions.

## Stop conditions
Stop if test leakage is discovered, ground truth is unreliable for critical slices, or model versions cannot be reproduced consistently.