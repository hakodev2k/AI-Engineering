# Imbalanced Learning

## Purpose
Build classifiers for rare outcomes without allowing majority-class metrics or naive resampling to hide poor decision performance.

## When to use
Use for fraud, failures, churn, incidents, rare diagnoses, and other low-prevalence targets.

## Inputs
Labels, prevalence, error costs, capacity constraints, features, and temporal context.

## Context to inspect
Label quality, sampling scheme, class drift, cohort prevalence, threshold policy, and intervention capacity.

## Core knowledge
Accuracy is usually misleading under imbalance. Precision-recall behavior, calibration, expected cost, recall at capacity, and ranking metrics often better reflect utility. Resampling changes effective priors and may require calibration.

## Procedure
1. Quantify prevalence overall and by cohort/time.
2. Establish trivial and business baselines.
3. Choose metrics aligned with the operational decision.
4. Use class weighting or resampling only inside training folds.
5. Compare methods under the original validation distribution.
6. Evaluate calibration after sampling or weighting.
7. Choose thresholds from costs or intervention capacity.
8. Inspect false positives and false negatives separately.
9. Stress test prevalence changes.
10. Document expected workload and residual misses.

## Decision points
Prefer thresholding and cost-sensitive learning before complex synthetic sampling when they solve the business objective. Use oversampling cautiously for sparse minority data.

## Common failure patterns
Oversampling before splitting, reporting accuracy, tuning on balanced test data, ignoring probability distortion, and optimizing recall without false-positive capacity.

## Verification
Evaluate on untouched natural-prevalence data and confirm threshold utility under realistic volumes.

## Expected output
A classifier and threshold policy with calibrated, cost-aware rare-event performance.

## Stop conditions
Stop when positive labels are too unreliable or too few to support credible validation.