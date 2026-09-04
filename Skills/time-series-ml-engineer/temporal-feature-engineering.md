# Temporal Feature Engineering

## Purpose
Design leakage-safe features that represent temporal structure, seasonality, recency, history, and known future context.

## When to use
Use when building or reviewing features for forecasting, temporal classification, or anomaly detection.

## Inputs
Prediction timestamp, horizon, raw temporal data, entity keys, covariate availability, calendar/domain metadata.

## Context to inspect
Inspect sampling cadence, timezones, historical windows, feature-computation pipelines, late data, and training/serving parity.

## Core knowledge
Lag, rolling, expanding, calendar, Fourier, change, trend, and recency features can be powerful but are valid only if their source values existed at prediction time. Rolling windows need precise closed/open boundary semantics.

## Procedure
1. Define the feature availability cutoff for each prediction.
2. Separate static, observed-past, and known-future variables.
3. Establish simple lag features aligned to horizon and cadence.
4. Add rolling statistics with explicit window boundaries and minimum observations.
5. Represent seasonality using calendar or cyclic/Fourier features when justified.
6. Add trend, difference, rate-of-change, and recency features where meaningful.
7. Encode entity history without crossing entity boundaries.
8. Treat missingness as a possible signal rather than automatically imputing it.
9. Compute features through the same logical path used in production.
10. Run leakage tests by shifting prediction cutoffs and checking feature provenance.
11. Remove redundant features using ablations rather than intuition alone.
12. Document definitions and availability guarantees.

## Decision points
Use raw lags when models can learn nonlinear interactions; use summarized windows when dimensionality or irregular history is problematic. Prefer known-future calendar features over proxying future outcomes.

## Common failure patterns
Future-aware rolling windows, incorrect lag direction, cross-entity contamination, local-time/DST bugs, feature computation after target aggregation, and offline-only features.

## Verification
Verify features against hand-calculated examples at historical cutoffs, run temporal leakage tests, compare offline and serving outputs, and confirm ablations improve validation performance consistently.

## Expected output
A documented, reproducible, leakage-safe feature set with temporal availability metadata.

## Stop conditions
Stop if feature event-time semantics are unknown, serving cannot reproduce a required feature, or feature construction requires future observations.