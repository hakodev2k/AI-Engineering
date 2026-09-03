# RL Evaluation and Benchmarking

## Purpose
Build evaluation protocols that distinguish genuine policy improvement from seed variance, simulator overfitting, reward artifacts, and narrow scenario gains.

## When to use
Use before comparing algorithms, approving a model change, publishing results, or promoting an RL policy toward production.

## Inputs
- Candidate policies
- Baseline policies
- Evaluation environments and scenario sets
- Seed policy and metrics
- Constraint and business KPIs

## Preconditions
Training and evaluation environments must be separable where possible. Primary metrics and safety metrics must be defined before reviewing results.

## Context to inspect
Inspect scenario distributions, seed counts, confidence intervals, episode length, stochasticity, reward decomposition, constraint violations, and whether hyperparameter tuning used evaluation data.

## Core knowledge
RL results are often high variance and selection-biased. Mean return alone is insufficient. Senior evaluation includes distributional metrics, tail behavior, paired comparisons, seed-level results, scenario slicing, constraint metrics, and simple baselines.

## Procedure
1. Freeze evaluation scenarios and primary metrics before final tuning.
2. Include random, heuristic, prior-production, and simpler algorithm baselines where applicable.
3. Evaluate across multiple independent training and environment seeds.
4. Report central tendency, dispersion, and tail outcomes.
5. Slice results by environment condition and initial state.
6. Track safety/constraint metrics independently from reward.
7. Run ablations for major architectural or algorithmic claims.
8. Compare equal interaction and compute budgets when relevant.
9. Inspect representative failure trajectories.
10. Repeat evaluation after any reward, environment, or preprocessing change.

## Decision points
Use paired tests when policies can be evaluated on matched stochastic scenarios. Prefer confidence intervals and effect sizes over threshold-only significance claims. Reject improvements smaller than operational variance unless they have other material benefits.

## Common failure patterns
- Reporting the best seed.
- Tuning on the test environment.
- Comparing unequal environment-step budgets.
- Ignoring tail constraint violations.
- Treating simulator reward as business success.

## Verification
A result is verified when it reproduces across seeds, survives scenario slicing, exceeds agreed baselines by a meaningful margin, and does not regress safety or operational metrics.

## Expected output
A reproducible benchmark report with seed-level results, scenario slices, uncertainty, baselines, failures, and go/no-go evidence.

## Stop conditions
Stop if evaluation data has been contaminated by tuning, scenario coverage is inadequate, or variance is too high to support the claimed conclusion.