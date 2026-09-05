# Downstream Utility Evaluation

## Purpose
Determine whether synthetic data actually improves the model, evaluation, analytics, or testing workload it was created to support.

## When to use
Use before approving synthetic data for training, augmentation, benchmarking, or operational testing.

## Inputs
Synthetic dataset, real training/validation data, downstream model or task, baseline metrics, acceptance thresholds, subgroup definitions.

## Preconditions
A trustworthy real-world holdout exists and has not been used to tune the synthetic generator.

## Context to inspect
Baseline model performance, learning curves, calibration, subgroup metrics, robustness metrics, training stability, class balance, feature importance.

## Core knowledge
Synthetic quality is ultimately task-dependent. A dataset can look statistically realistic yet harm downstream performance. Utility evaluation should isolate the contribution of synthetic data through controlled experiments.

## Procedure
1. Establish a real-data-only baseline.
2. Define mixes of real and synthetic data to compare.
3. Hold model architecture and training procedure constant unless the experiment explicitly studies them.
4. Train or evaluate across multiple seeds.
5. Measure headline, subgroup, calibration, robustness, and rare-event metrics.
6. Compare learning curves and sample efficiency.
7. Check for improvements limited only to synthetic-like test distributions.
8. Analyze regressions by scenario and subgroup.
9. Determine the synthetic-data mix that gives the best risk-adjusted utility.
10. Record confidence intervals and experimental limitations.

## Decision points
Use synthetic-only training only when real-data constraints require it and real holdout performance supports the choice. Prefer augmentation when synthetic data complements rather than replaces real coverage.

## Common failure patterns
Evaluating on synthetic test data, changing multiple training variables simultaneously, ignoring variance across seeds, and reporting only aggregate accuracy.

## Verification
Synthetic data is approved only when controlled experiments show measurable benefit or justified cost/privacy advantages on independent real-world evaluation.

## Expected output
A utility experiment report with baselines, synthetic mixes, segment metrics, confidence, and deployment recommendation.

## Stop conditions
Stop when no independent real-world validation is available or synthetic data causes unacceptable regressions in critical segments.