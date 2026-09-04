# Loss Design and Class Imbalance

## Purpose
Choose and validate training objectives that reflect task geometry, class imbalance, noisy labels, and operational error costs without masking data problems.

## When to use
Use when minority classes fail, gradients are dominated by easy examples, localization/segmentation terms conflict, or custom losses are proposed.

## Inputs
Task definition, label distribution, error costs, baseline losses, training curves, and slice-level evaluation.

## Preconditions
Evaluation metrics and label semantics are stable enough to judge whether a loss change improves the actual objective.

## Context to inspect
Inspect sampling, prevalence, label noise, per-class gradients/losses, multi-task weights, confidence calibration, and whether imbalance exists in examples, pixels, objects, or sequences.

## Core knowledge
Cross-entropy, focal loss, Dice/Tversky-style losses, IoU variants, metric-learning objectives, class weighting, re-sampling, and hard-example mining trade bias, variance, calibration, and optimization stability. Loss is a surrogate, not the product metric.

## Procedure
1. Characterize imbalance and error cost quantitatively.
2. Verify data and labels before compensating in the objective.
3. Establish the simplest standard-loss baseline.
4. Measure per-class and per-slice errors.
5. Decide whether sampling, weighting, or objective changes best address the failure.
6. Introduce one loss modification at a time.
7. Monitor gradient/loss scale and numerical stability.
8. Compare calibration and threshold behavior, not only ranking metrics.
9. Run controlled ablations across multiple seeds.
10. Inspect whether gains come from rare critical cases or metric artifacts.
11. Re-evaluate after production-prevalence weighting.
12. Document the rationale and rollback baseline.

## Decision points
Prefer sampling when data exposure is the core issue; weighting when error costs or prevalence justify it; focal-style losses when easy negatives dominate. Avoid custom objectives when standard losses plus better data solve the problem.

## Common failure patterns
Extreme weights destabilizing training, double-correcting imbalance with both sampling and weighting, optimizing Dice while calibration degrades, and using loss changes to hide mislabeled classes.

## Verification
Verify multi-seed gains on held-out slices, stable optimization, calibration/threshold impact, and improvement in the operational metric.

## Expected output
A justified objective configuration with ablation evidence, stability checks, and documented trade-offs.

## Stop conditions
Stop if label quality is the dominant failure, the custom objective cannot be numerically stabilized, or gains disappear on representative prevalence.