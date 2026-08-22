# Hyperparameter Optimization

## Purpose
Improve model configuration efficiently without overfitting the validation process or wasting compute.

## When to use
After a trustworthy baseline and evaluation protocol exist.

## Inputs
Training pipeline, search space, metric, compute budget, split strategy, baseline configuration.

## Context to inspect
Sensitive parameters, training variance, resource limits, early-stopping behavior, reproducibility controls.

## Core knowledge
Search-space design matters more than brute force. Random/Bayesian methods often outperform grids for sparse useful regions. Repeated tuning can overfit validation data.

## Procedure
1. Freeze evaluation protocol and baseline.
2. Identify high-impact hyperparameters from model behavior.
3. Define bounded, scale-appropriate distributions.
4. Set compute and trial budgets.
5. Use early stopping/pruning where valid.
6. Track every trial, seed, artifact, and metric.
7. Inspect parameter sensitivity and variance.
8. Retrain finalists and confirm on untouched test data.

## Decision points
Use manual targeted tuning for small spaces; random search for broad exploration; Bayesian optimization for expensive evaluations with meaningful signal.

## Common failure patterns
Tuning before fixing data issues, searching arbitrary ranges, test-set peeking, comparing incomplete runs, and ignoring training cost.

## Verification
Best configuration reproduces its gain across reruns and remains superior on the final test set within expected variance.

## Expected output
A reproducible search record and justified production configuration.

## Stop conditions
Stop when gains fall below noise/cost thresholds or compute budget is exhausted.