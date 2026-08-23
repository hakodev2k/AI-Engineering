# Text Classification and Multilabel Modeling

## Purpose
Design and deliver robust text classifiers with calibrated thresholds, class-aware evaluation, and production-safe handling of uncertainty.

## When to use
Use for intent, topic, sentiment, routing, moderation, compliance, or document classification.

## Inputs
Label schema, labeled corpus, class costs, latency limits, baseline, deployment interface.

## Preconditions
Labels have acceptable human consistency and train/evaluation leakage is controlled.

## Context to inspect
Class imbalance, text lengths, domain/language slices, baseline errors, prior thresholds, model serving constraints.

## Core knowledge
Accuracy alone hides rare-class failures. Multilabel tasks require per-label thresholding, dependency awareness, calibration, and explicit abstention when error cost is asymmetric.

## Procedure
1. Establish heuristic or simple-model baseline.
2. Split data by entity/time/source to minimize leakage.
3. Select representation/model proportional to task complexity.
4. Train with imbalance handling only when evidence supports it.
5. Evaluate per-class precision, recall, F1, PR curves, and key slices.
6. Calibrate probabilities where downstream decisions depend on confidence.
7. Tune thresholds against business error costs.
8. Inspect confusion clusters and adversarial wording.
9. Define unknown/abstain behavior.
10. Validate latency, throughput, and reproducibility.

## Decision points
Prefer compact classifiers for bounded taxonomies and high throughput. Use larger encoders when context and domain variability materially improve errors. Prefer multilabel over forced single-label when categories genuinely overlap.

## Common failure patterns
Random leakage, global threshold for all labels, optimizing macro metrics without costs, class weighting without validation, and no unknown class strategy.

## Verification
Baseline is beaten on agreed metrics, costly classes meet thresholds, calibration is measured, and production-like load tests pass.

## Expected output
Trained model, thresholds, evaluation report, slice analysis, serving contract, and rollback criteria.

## Stop conditions
Stop if label quality is below model error, evaluation set is contaminated, or required recall/precision is infeasible.