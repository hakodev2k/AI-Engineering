# Collaborative Filtering

## Purpose
Apply user-item interaction structure to discover affinity beyond explicit content similarity.

## When to use
Use when interaction history is sufficiently dense and shared behavior is informative.

## Inputs
Point-in-time interaction matrix, confidence weights, user/item filters, and evaluation splits.

## Context to inspect
Sparsity, popularity skew, repeat behavior, implicit versus explicit feedback, cold-start share, and temporal drift.

## Core knowledge
Neighborhood, matrix factorization, implicit-feedback objectives, and learned collaborative representations encode different assumptions. Popularity bias and missing-not-at-random feedback require explicit treatment.

## Procedure
1. Characterize density and interaction distributions.
2. Build popularity and co-occurrence baselines.
3. Choose weighting for event strength and recency.
4. Train collaborative model with time-aware splits.
5. Tune regularization/rank using ranking metrics.
6. Analyze performance by activity and popularity cohorts.
7. Combine with content signals for cold-start resilience when needed.
8. Validate serving cost and refresh cadence.

## Decision points
Use matrix methods for strong scalable baselines; neighborhoods for interpretability/locality; hybrid models when metadata materially improves sparse cases.

## Common failure patterns
Random splits, treating all missing entries as negatives, popularity leakage, overfitting power users, and ignoring new users/items.

## Verification
Compare against popularity, evaluate temporal holdout metrics and cohort coverage, and inspect representative recommendations.

## Expected output
A collaborative component with documented weighting, evaluation, limitations, and refresh policy.

## Stop conditions
Stop if interaction semantics are unreliable or sparsity makes collaborative signal indistinguishable from popularity.