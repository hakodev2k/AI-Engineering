# Model Selection and Baselines

## Purpose
Choose the least complex model family that satisfies quality, latency, interpretability and operating constraints.

## When to use
Use when establishing a first model, replacing an incumbent, or deciding whether added complexity is justified.

## Inputs
Problem type, baseline metrics, dataset scale, feature types, constraints and deployment environment.

## Context to inspect
Existing models, inference hardware, retraining cadence, explainability requirements and failure costs.

## Core knowledge
Model selection is multi-objective. Strong simple baselines expose whether sophisticated methods create real incremental value.

## Procedure
1. Establish heuristic and simple statistical baselines.
2. Define candidate families appropriate to data modality.
3. Fix comparable splits and metrics.
4. Train candidates with controlled preprocessing.
5. Measure quality, calibration, latency, memory, training cost and stability.
6. Evaluate critical slices.
7. Analyze error overlap and failure modes.
8. Prefer the simplest candidate meeting acceptance thresholds.
9. Document rejected alternatives and trade-offs.
10. Preserve reproducible configurations.

## Decision points
Choose linear/tree models for structured problems when adequate; deep models when representation learning materially improves difficult modalities; ensembles only when gains justify operational complexity.

## Common failure patterns
Skipping baselines, comparing on different splits, selecting by one metric, overfitting hyperparameters, ignoring inference constraints.

## Verification
Re-run the selected configuration from clean artifacts and confirm gains persist on untouched evaluation data and required slices.

## Expected output
A model-selection record with reproducible evidence and trade-off rationale.

## Stop conditions
Stop if candidates are not compared fairly or deployment constraints cannot be measured.