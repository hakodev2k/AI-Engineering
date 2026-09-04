# Data Drift Detection

## Purpose
Detect meaningful changes in production inputs that can invalidate model assumptions before user-visible quality collapses.

## When to use
Use for any production model exposed to changing populations, upstream schemas, seasonality, or evolving behavior.

## Inputs
- Training reference data
- Production feature streams
- Feature definitions
- Critical segments
- Model versions

## Context to inspect
Inspect feature distributions, categorical cardinality, missingness, schema changes, event timing, traffic mix, and upstream pipeline releases.

## Core knowledge
Not all statistical drift matters. Reliable monitoring distinguishes data-quality failures, expected seasonality, covariate shift, label shift, and drift that materially affects model decisions.

## Procedure
1. Choose reference windows representative of intended operation.
2. Monitor schema, null rates, ranges, cardinality, and distribution statistics.
3. Use suitable distance tests for numeric and categorical features.
4. Track drift by important cohorts and model version.
5. Rank features by model sensitivity and business importance.
6. Correlate drift with prediction distribution and quality changes.
7. Define thresholds from historical variation, not arbitrary constants.
8. Route material drift to investigation rather than automatic retraining by default.

## Decision points
Prefer simple distribution checks for interpretable features; use multivariate or embedding-based drift detection when interactions dominate. Ignore benign drift only when impact evidence supports it.

## Common failure patterns
- Alerting on every statistically significant change.
- Using stale or unrepresentative references.
- Missing schema-level failures.
- Ignoring segment-specific drift.

## Verification
Backtest detectors against known changes and confirm alerts correlate with meaningful data or model behavior changes.

## Expected output
A drift-monitoring design with references, metrics, thresholds, severity rules, and investigation workflow.

## Stop conditions
Stop if feature definitions or reference populations are not stable enough to interpret drift.