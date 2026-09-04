# Production Incident Debugging

## Purpose
Diagnose and contain production failures in time-series ML systems by reconstructing the exact temporal state of a bad prediction and separating data, feature, model, serving, and regime-change causes.

## When to use
Use when forecasts are stale, missing, suddenly biased, implausible, misaligned by time, materially worse than baselines, or associated with downstream operational incidents.

## Inputs
- Incident description and impact window
- Prediction outputs and inference metadata
- Model, feature, and data-pipeline versions
- Raw and processed source data
- Logs, metrics, and traces
- Realized targets when mature
- Baseline forecasts
- Recent deployments and configuration changes

## Preconditions
Preserve incident evidence before changing pipelines or regenerating artifacts. Use read-only inspection first unless immediate containment requires an approved operational action.

## Context to inspect
Inspect exact prediction cutoffs, entity IDs, timezone and daylight-saving behavior, event/processing timestamps, upstream freshness, feature values, covariate versions, model rollout state, caches, recurrent state, target revisions, and recent regime changes.

## Core knowledge
Temporal incidents often resemble model failures while originating in timestamp alignment, stale covariates, late data, cache keys, revised history, state corruption, or serving/training skew. Root-cause analysis requires reconstructing the information available at the original prediction time rather than recomputing from today's corrected data.

## Procedure
1. Establish incident severity, affected entities, horizons, and downstream impact.
2. Record the first known bad prediction and build a precise event timeline.
3. Identify model, preprocessing, feature schema, configuration, and deployment versions active at that cutoff.
4. Check serving health, timeouts, fallback use, cache hits, and partial failures.
5. Validate cutoff, horizon, timezone, cadence, and entity alignment for representative bad outputs.
6. Inspect upstream freshness, missingness, duplicate records, late arrival, and schema changes.
7. Reconstruct the exact feature vector and covariate versions used for one or more affected predictions.
8. Compare reconstructed features with training definitions and expected as-of values.
9. Re-run the same model artifact on the reconstructed inputs in a controlled environment.
10. Compare the primary model with naive, previous-model, and deterministic fallback outputs for the same cutoffs.
11. Slice impact by model version, entity, horizon, data source, and deployment cohort to localize the failure domain.
12. Check for structural regime change only after data and serving defects have been ruled out.
13. Contain impact using an approved rollback, previous model, baseline forecast, or degraded mode when necessary.
14. Fix the narrowest confirmed root cause rather than changing multiple components simultaneously.
15. Add regression tests reproducing the incident, including temporal boundary and as-of data cases.
16. Backtest the fix across the incident window and representative historical periods.
17. Verify production recovery using fresh predictions and downstream acceptance criteria.
18. Document root cause, contributing factors, detection gaps, containment, permanent remediation, and follow-up controls.

## Decision points
- Roll back when a recent model or serving change is strongly correlated with impact and a known-good version exists.
- Use a baseline fallback when model inputs cannot be trusted, rather than serving apparently precise predictions from corrupted state.
- Correct data before retraining when the failure is caused by pipeline corruption.
- Retrain only when evidence supports model staleness or regime change rather than infrastructure failure.

## Common failure patterns
- Recomputing historical features from corrected current data and assuming they match incident-time state.
- Debugging only the model while ignoring timestamps and feature freshness.
- Making multiple emergency changes that destroy causal evidence.
- Comparing predictions against targets that have not matured for the relevant horizon.
- Retrying failed upstream dependencies indefinitely.
- Declaring recovery because the service returns HTTP success while predictions remain temporally wrong.
- Removing a symptom without adding a regression test or detection control.

## Verification
Implementation of a fix is not sufficient. Verify the original failure is reproduced before the fix, no longer reproduces afterward, historical backtests remain acceptable, temporal contracts and feature parity hold, production outputs recover, and fallback/rollback paths work as designed.

## Expected output
An incident record containing timeline, affected scope, reconstructed prediction evidence, confirmed root cause, containment action, verified remediation, regression coverage, and monitoring improvements.

## Stop conditions
Stop and escalate if evidence preservation conflicts with urgent safety requirements, destructive production changes require approval, required logs or historical as-of data are unavailable, permissions are insufficient, or the evidence does not support a single safe remediation path.