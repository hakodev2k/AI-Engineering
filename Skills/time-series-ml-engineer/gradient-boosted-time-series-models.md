# Gradient-Boosted Time-Series Models

## Purpose
Build robust tree-based forecasting or temporal prediction systems using leakage-safe lagged features and global learning across many series.

## When to use
Use when nonlinear interactions, heterogeneous entities, rich covariates, or tabular infrastructure make boosted trees a strong fit.

## Inputs
Temporal feature table, entity keys, horizons, target, covariate availability, backtest definition.

## Context to inspect
Inspect feature-generation timing, categorical handling, entity imbalance, sample weighting, horizon strategy, and serving constraints.

## Core knowledge
Gradient boosting can outperform sequence models when well-designed lag/rolling/calendar features capture dynamics. Global models share information across entities but can overfit dominant series. Direct, recursive, and multi-output horizon strategies trade accuracy, complexity, and error propagation.

## Procedure
1. Start from verified baseline and temporal splits.
2. Generate lag, rolling, calendar, static, and known-future features without leakage.
3. Decide whether to train one global model, per-entity models, or grouped models.
4. Choose direct, recursive, or horizon-as-feature prediction strategy.
5. Encode entity/category variables consistently between training and serving.
6. Tune depth, learning rate, regularization, subsampling, and minimum leaf constraints using temporal folds.
7. Consider sample weights for entity or recency imbalance.
8. Inspect feature importance with caution; use permutation/ablation tests for stronger evidence.
9. Analyze residuals by horizon, entity, season, and volume.
10. Measure inference cost and feature-computation latency.
11. Freeze preprocessing/model artifacts together.
12. Validate production parity on historical replays.

## Decision points
Global models are preferred when many related series share structure; local models may be better for highly distinct, high-volume entities. Direct horizons avoid recursive error accumulation but increase model count or output complexity.

## Common failure patterns
Leaky rolling features, random validation, entity ID memorization, dominant-series bias, unbounded category growth, and offline features unavailable online.

## Verification
Verify cutoff-safe feature generation, temporal fold performance, horizon-level metrics, unseen-entity behavior, deterministic serving features, and latency under realistic batch sizes.

## Expected output
A reproducible boosted-tree temporal model with documented horizon strategy, feature contract, backtest evidence, and serving package.

## Stop conditions
Stop if feature availability cannot be guaranteed, entity leakage dominates performance, or deployment cannot reproduce training-time features.