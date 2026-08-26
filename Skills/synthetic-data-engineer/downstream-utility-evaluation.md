# Downstream Utility Evaluation

## Purpose
Prove synthetic data helps the actual downstream model, analytics, or testing objective.

## When to use
Before adopting a synthetic dataset or changing its generator.

## Inputs
Synthetic/real datasets, downstream pipeline, real holdout, baseline, target metrics, and critical slices.

## Context to inspect
Inspect train/eval partitions, preprocessing, hyperparameters, class balance, and leakage risks.

## Core knowledge
Fidelity is a proxy; downstream performance is the operational test. Synthetic-only evaluation can conceal domain gap.

## Procedure
1. Freeze a real holdout never used by the generator.
2. Establish real-only and current-production baselines.
3. Train/evaluate synthetic-only where informative.
4. Test synthetic-plus-real mixtures at multiple ratios.
5. Keep downstream training settings controlled.
6. Measure overall and slice metrics.
7. Check calibration and failure severity, not only headline accuracy.
8. Repeat with multiple generation seeds.
9. Quantify cost/benefit versus collecting real data.

## Decision points
Adopt synthetic data only when it improves required outcomes or replaces real data with acceptable loss under a valid constraint.

## Common failure patterns
Evaluating on synthetic test data; tuning holdout repeatedly; changing model architecture during comparison; ignoring slice regressions.

## Verification
Results reproduce across seeds and clear predefined thresholds on real holdout data.

## Expected output
Controlled utility experiment and adoption recommendation.

## Stop conditions
Stop if real holdout is contaminated or experimental controls cannot isolate synthetic-data impact.