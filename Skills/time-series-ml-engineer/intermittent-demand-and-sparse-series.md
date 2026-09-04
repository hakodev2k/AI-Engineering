# Intermittent Demand and Sparse Series

## Purpose
Model series dominated by zeros, rare events, or irregular positive demand without allowing conventional loss functions to hide poor behavior.

## When to use
Use for spare parts, incidents, low-volume products, rare transactions, or event counts with long zero runs.

## Inputs
Historical sparse series, horizon, aggregation cadence, stockout/censoring information, business costs, hierarchy.

## Context to inspect
Inspect zero-run lengths, nonzero-size distribution, aggregation effects, censoring, stockouts, new entities, and whether zeros mean true absence or missing observations.

## Core knowledge
Sparse series often require separate treatment of occurrence and magnitude. Croston-style methods, hurdle/two-stage models, count distributions, aggregation, and hierarchical pooling can outperform generic regression. Percentage metrics are frequently unstable near zero.

## Procedure
1. Distinguish true zeros from missing or censored observations.
2. Profile inter-arrival times and positive magnitudes.
3. Establish zero, seasonal, and intermittent-demand baselines.
4. Evaluate whether temporal aggregation improves signal without harming decisions.
5. Compare direct demand models with occurrence-plus-size formulations.
6. Consider Poisson/negative-binomial or zero-inflated distributions when count semantics fit.
7. Pool information across related entities when individual histories are insufficient.
8. Use metrics robust to zeros and aligned with inventory/service costs.
9. Evaluate calibration of positive-demand probability separately from magnitude.
10. Test long zero runs and bursts explicitly.
11. Define cold-start and no-history fallback rules.

## Decision points
Use two-stage models when occurrence and size have distinct drivers. Aggregate time when the operational decision permits it. Prefer hierarchical/global pooling when leaf series are too sparse to estimate independently.

## Common failure patterns
MAPE on zeros, treating stockout zeros as no demand, overfitting rare positives, ignoring burstiness, and declaring accuracy from a model that predicts zero almost always.

## Verification
Verify event recall, positive-size error, decision-level cost, zero-run behavior, calibration, and performance versus intermittent-demand baselines.

## Expected output
A sparse-series modeling strategy with explicit occurrence, magnitude, metrics, and fallback behavior.

## Stop conditions
Stop if zero semantics or censoring cannot be established or history is insufficient for the required granularity.