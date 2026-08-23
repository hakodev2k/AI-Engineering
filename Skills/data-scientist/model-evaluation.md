# Model Evaluation

## Purpose
Determine whether a model generalizes, supports the intended decision, and fails within acceptable bounds.

## When to use
Use before model approval, after material retraining, and when comparing candidate approaches.

## Inputs
Model predictions, ground truth, validation design, business costs, cohorts, and baseline.

## Context to inspect
Class balance, temporal shifts, sampling, threshold policy, label delay, and operational decision rules.

## Core knowledge
No single metric captures model quality. Ranking, probability estimation, regression error, calibration, threshold utility, and cohort behavior require different measures. Aggregate metrics can hide harmful failures.

## Procedure
1. Confirm evaluation data is independent and representative.
2. Compare against business and statistical baselines.
3. Measure task-appropriate primary and secondary metrics.
4. Evaluate calibration and threshold behavior where relevant.
5. Slice performance by important cohorts, time, and operating conditions.
6. Inspect error distributions and high-impact failures.
7. Quantify uncertainty with suitable intervals or resampling.
8. Stress test plausible distribution shifts.
9. Translate metrics into expected operational outcomes.
10. Define acceptance criteria and residual risks.

## Decision points
Choose thresholds from decision costs and capacity, not arbitrary 0.5 defaults. Prefer calibration when downstream consumers need probabilities.

## Common failure patterns
Accuracy on imbalanced data, test-set tuning, aggregate-only reporting, ignoring uncertainty, and claiming improvement from statistically noisy differences.

## Verification
Reproduce metrics from saved predictions and verify cohort definitions, thresholds, baselines, and uncertainty calculations.

## Expected output
An evaluation report connecting technical metrics to operational utility and known failure modes.

## Stop conditions
Stop when ground truth is unreliable, evaluation is contaminated, or important cohorts cannot be assessed.