# Learning to Rank

## Purpose
Train and validate rankers that order candidates according to user and business utility.

## When to use
Use when candidate retrieval exists and ranking quality is the primary optimization surface.

## Inputs
Exposure-aware examples, features, labels, groups/queries, candidate provenance, baseline ranker, and online constraints.

## Context to inspect
Label construction, feature availability at serving time, position bias, negative sampling, calibration, and latency.

## Core knowledge
Pointwise, pairwise, and listwise losses optimize different surrogates. Ranking metrics are query-grouped; sampling and exposure policy affect learned preferences.

## Procedure
1. Define ranking unit and label semantics.
2. Build point-in-time training examples from exposed candidates.
3. Establish simple linear/tree baseline.
4. Select loss aligned with ordering objective.
5. Tune with time-based validation and query-level metrics.
6. Analyze feature importance and cohort regressions.
7. Measure calibration if scores drive thresholds or blending.
8. Benchmark inference latency and online feature availability.

## Decision points
Prefer tree rankers for strong tabular baselines and interpretability; neural rankers when representation/interactions justify complexity. Use pair/list losses when relative ordering is more meaningful than absolute labels.

## Common failure patterns
Training on unavailable features, random row splits, label leakage, biased negatives, metric aggregation errors, and latency-blind complexity.

## Verification
Reproduce offline metrics, compare against baseline by cohort, validate serving parity, and gate with online experimentation.

## Expected output
A versioned ranker with data contract, metrics, serving requirements, and rollout criteria.

## Stop conditions
Stop if training-serving parity cannot be established or evaluation lacks exposure-aware examples.