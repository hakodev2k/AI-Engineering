# Feature Engineering and Selection

## Purpose
Create stable, causally available and maintainable features that improve signal without leakage or unnecessary complexity.

## When to use
Use after problem framing and split design, or when diagnosing model quality and serving cost.

## Inputs
Raw fields, domain definitions, prediction-time boundary, baseline model, feature importance diagnostics and serving constraints.

## Context to inspect
Existing transformations, online/offline computation paths, freshness, ownership, missingness and feature costs.

## Core knowledge
Useful features encode relevant signal available at prediction time. Feature value must be judged by out-of-sample contribution, stability and operational cost, not correlation alone.

## Procedure
1. Start from a simple baseline feature set.
2. Derive candidate features from domain hypotheses.
3. Enforce point-in-time correctness.
4. Handle missingness explicitly and preserve meaningful missing indicators.
5. Encode categorical variables with leakage-safe methods.
6. Normalize only when model behavior requires it.
7. Measure incremental validation value with ablations.
8. Test stability across time and important slices.
9. Remove redundant, unstable, expensive or non-actionable features.
10. Version feature definitions and parity tests.

## Decision points
Prefer simpler features when gains are marginal. Use learned representations when raw high-dimensional inputs justify their cost. Favor online computation only when freshness materially matters.

## Common failure patterns
Future aggregates, uncontrolled high-cardinality encodings, train-serving skew, proxy discrimination, feature explosion and importance interpreted as causality.

## Verification
Run ablations, parity checks and point-in-time tests; compare latency/cost and slice metrics before and after changes.

## Expected output
A justified feature set with definitions, provenance, availability and measured contribution.

## Stop conditions
Stop using a feature when provenance, legal basis, serving parity or prediction-time availability cannot be established.