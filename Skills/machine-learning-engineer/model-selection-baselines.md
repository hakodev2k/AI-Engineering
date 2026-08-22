# Model Selection and Baselines

## Purpose
Select the simplest model family that satisfies quality, latency, cost, interpretability, and operational constraints.

## When to use
At experiment start, after a baseline plateaus, or when production constraints change.

## Inputs
Task definition, dataset characteristics, metrics, constraints, baseline results, serving environment.

## Context to inspect
Sample size, feature types, class balance, nonlinearity, explainability needs, inference budget, retraining cadence.

## Core knowledge
Model sophistication is justified by measured incremental value. Strong naive, heuristic, linear, and tree baselines expose whether complexity is worthwhile.

## Procedure
1. Define naive and business-rule baselines.
2. Train a low-complexity statistical baseline.
3. Identify model families compatible with data and constraints.
4. Compare them under identical splits and metrics.
5. Measure latency, memory, model size, and training cost.
6. Analyze subgroup and failure behavior.
7. Select the Pareto-efficient candidate rather than metric winner alone.
8. Record rationale and rejected alternatives.

## Decision points
Prefer interpretable/simple models when performance differences are small. Use deep models when representation learning or scale provides demonstrated value.

## Common failure patterns
Starting with the largest model, comparing on different splits, ignoring calibration and operational cost, and chasing leaderboard gains below noise.

## Verification
Candidate beats agreed baselines with statistically and operationally meaningful gains and meets nonfunctional constraints.

## Expected output
A model-selection record with evidence, trade-offs, and chosen baseline/candidate.

## Stop conditions
Stop if evaluation is invalid, gains are not reproducible, or no candidate meets mandatory constraints.