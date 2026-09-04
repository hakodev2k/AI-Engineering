# Image Classification

## Purpose
Design, train, evaluate, and productionize image classifiers whose thresholds and error behavior match the operational decision.

## When to use
Use when the required output is one or more labels for an image or crop and explicit localization is unnecessary.

## Inputs
Label ontology, curated dataset, baseline, class prevalence, error costs, deployment constraints, and representative production samples.

## Preconditions
Labels are operationally defined and the image contains sufficient evidence for the class decision.

## Context to inspect
Check single-label versus multi-label semantics, class hierarchy, imbalance, duplicates, background correlations, crop generation, resolution, and confidence use downstream.

## Core knowledge
Softmax classification assumes mutually exclusive classes; sigmoid-style objectives fit independent multi-label targets. Calibration, threshold selection, long-tail behavior, and slice metrics matter more than top-line accuracy in many production systems.

## Procedure
1. Confirm label semantics and exclusivity.
2. Establish majority/simple pretrained baselines.
3. Audit class and condition imbalance.
4. Choose input resolution based on discriminative detail.
5. Train with an architecture and loss appropriate to label structure.
6. Track per-class precision, recall, F1, and confusion patterns.
7. Analyze confidence calibration and threshold-dependent costs.
8. Inspect false positives/negatives visually by slice.
9. Test robustness to capture and preprocessing variation.
10. Select thresholds using validation data and operational cost.
11. Verify target-hardware serving behavior.
12. Add regression examples for high-cost errors.

## Decision points
Use multi-label classification when classes can co-occur. Consider hierarchical prediction when taxonomy structure matters. Escalate to detection when classification fails because object location or multiplicity is essential.

## Common failure patterns
Accuracy hiding minority-class failure, class leakage through watermarks/backgrounds, threshold tuning on test data, mislabeled hard negatives, and crop logic differing between training and production.

## Verification
Verify held-out and slice metrics, calibration, chosen thresholds, regression cases, preprocessing parity, and target latency.

## Expected output
A classifier with versioned data/model configuration, threshold policy, error analysis, tests, and deployment contract.

## Stop conditions
Stop if labels are not visually identifiable, localization is required to distinguish classes, or critical classes lack enough evidence for defensible evaluation.