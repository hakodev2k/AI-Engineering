# Model Selection and Trade-offs

## Purpose
Choose a model family based on measurable requirements rather than novelty, balancing predictive quality, latency, memory, interpretability, maintainability, and operational risk.

## When to use
Use during initial architecture, major model redesign, or when an existing model is too slow, costly, opaque, or fragile.

## Inputs
- Problem formulation
- Dataset characteristics
- Baseline results
- Latency and throughput targets
- Explainability and resource constraints

## Context to inspect
Inspect data volume, feature types, label noise, serving hardware, retraining frequency, regulatory constraints, and existing operational tooling.

## Core knowledge
A Senior ML Engineer treats model choice as a systems decision. Linear models, tree ensembles, kernel methods, neural networks, probabilistic models, and specialized architectures have different bias, variance, compute, data, calibration, and deployment profiles.

## Procedure
1. Define hard constraints and ranking criteria.
2. Establish simple model baselines.
3. Shortlist model families compatible with data and serving constraints.
4. Compare them using identical splits and preprocessing.
5. Measure accuracy, calibration, latency, memory, training cost, and robustness.
6. Examine performance by critical segments.
7. Assess explainability, retraining complexity, and dependency burden.
8. Run statistical comparison across seeds or folds when variance matters.
9. Prefer the simplest model that meets requirements with adequate margin.
10. Document why rejected alternatives were not chosen.

## Decision points
Prefer tree ensembles for heterogeneous tabular data and strong non-linear baselines; linear models for sparse/high-dimensional or highly interpretable settings; neural models when representation learning and scale justify complexity. Distill or compress when a large teacher creates value but cannot satisfy serving constraints.

## Common failure patterns
- Selecting by a single leaderboard metric.
- Ignoring inference cost.
- Comparing models with different data leakage.
- Adopting deep learning without enough data or benefit.
- Ignoring calibration and tail behavior.

## Verification
Verify the selected model meets acceptance metrics, operational budgets, critical-segment requirements, and reproducibility expectations on the frozen evaluation protocol.

## Expected output
A model-selection decision with benchmark evidence, trade-off table, rejected alternatives, and production rationale.

## Stop conditions
Stop if requirements conflict without prioritization, evaluation is contaminated, or serving constraints are unknown.