# Classification Modeling

## Purpose
Design, train, and validate image classification models that meet task, latency, robustness, and maintainability requirements.

## When to use
Use for single-label, multi-label, hierarchical, or attribute classification tasks.

## Inputs
Dataset, label ontology, baseline metrics, compute budget, deployment constraints.

## Preconditions
Classes and evaluation criteria are stable enough to train against.

## Context to inspect
Class imbalance, visual ambiguity, input resolution, pretrained backbones, loss functions, thresholding needs.

## Core knowledge
Architecture choice matters less than matching capacity, inductive bias, data scale, and operating constraints. Multi-label systems require calibrated per-class decision logic.

## Procedure
1. Establish a simple pretrained baseline.
2. Choose resolution and backbone using resource budgets.
3. Address imbalance with sampling, weighting, or focal-style losses when justified.
4. Track train/validation curves and per-class metrics.
5. Tune thresholds on held-out data.
6. Run error analysis by condition and subgroup.
7. Compare candidate models using both quality and serving cost.
8. Freeze reproducible training configuration.

## Decision points
Fine-tune vs feature extraction; binary heads vs softmax; larger model vs higher-quality data.

## Common failure patterns
Accuracy-only evaluation, test-set tuning, unstable thresholds, ignoring calibration, overfitting rare classes.

## Verification
Reproduce metrics from a clean run; verify per-class recall/precision, calibration, latency, and representative failures.

## Expected output
Selected model, training config, metric report, thresholds, and known limitations.

## Stop conditions
Stop when class definitions are inconsistent, leakage is detected, or deployment budgets cannot be met.