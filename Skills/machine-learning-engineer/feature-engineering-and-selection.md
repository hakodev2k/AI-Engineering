# Feature Engineering and Selection

## Purpose
Design robust predictive features that improve signal while preserving inference-time validity, maintainability, and operational efficiency.

## When to use
Use when building tabular, ranking, forecasting, or classical ML systems; when feature sets grow uncontrolled; or when production skew appears.

## Inputs
- Raw data sources
- Model objective
- Feature-generation code
- Inference constraints
- Existing feature importance and error analysis

## Context to inspect
Inspect source freshness, event-time semantics, feature ownership, transformations, cardinality, missingness, online/offline computation paths, and feature cost.

## Core knowledge
Useful features encode stable signal, not artifacts. Senior practice balances predictive value against leakage risk, compute cost, latency, interpretability, and drift exposure. Selection should use validation evidence rather than importance scores alone.

## Procedure
1. Start from domain hypotheses tied to the target.
2. Confirm each candidate is available at decision time.
3. Build transformations with deterministic, versioned logic.
4. Handle missing values explicitly and preserve missingness signals when meaningful.
5. Encode categorical variables according to cardinality and model family.
6. For aggregates, define entity, window, cutoff, and late-arrival behavior.
7. Measure incremental value using controlled ablations.
8. Remove redundant, unstable, expensive, or leakage-prone features.
9. Test feature computation on historical point-in-time data.
10. Document ownership, freshness, and fallback behavior.

## Decision points
Prefer model-native handling when it reduces preprocessing complexity. Use learned embeddings when semantic or high-cardinality structure justifies them. Favor fewer stable features when marginal lift is small but serving complexity rises.

## Common failure patterns
- Features computed with future data.
- Train/serve transformation mismatch.
- High-cardinality identifiers memorized by the model.
- Unbounded rolling windows.
- Selecting features only from global importance rankings.

## Verification
Verify point-in-time correctness, deterministic recomputation, ablation lift, expected latency, and parity between training and serving feature values.

## Expected output
A justified, versioned feature set with definitions, lineage, evidence of value, serving requirements, and quality checks.

## Stop conditions
Stop if point-in-time correctness cannot be proven, online computation is infeasible, or feature ownership and freshness requirements are unresolved.