# Time-Series Problem Formulation

## Purpose
Turn an ambiguous temporal prediction or detection requirement into a precise time-series ML problem with explicit horizon, latency, target semantics, constraints, baselines, and deployment assumptions.

## When to use
Use before building forecasting, nowcasting, temporal classification, sequence regression, or anomaly-detection systems. Do not start with model selection until the decision process and temporal contract are clear.

## Inputs
- Business or operational objective
- Target definition and decision cadence
- Historical timestamped data
- Forecast or detection horizon
- Latency and freshness requirements
- Cost of errors and intervention rules

## Context to inspect
Inspect event time versus processing time, timezone semantics, sampling cadence, missing periods, label availability, seasonality, known-future covariates, entity hierarchy, cold-start cases, and downstream consumers.

## Core knowledge
Time-series problems are defined by temporal availability. A feature valid historically may be unavailable at prediction time. Horizon, lead time, aggregation window, and decision cadence materially change model design. Forecasting, anomaly detection, survival/event prediction, and temporal classification require different targets and evaluation procedures.

## Procedure
1. Identify the decision the prediction supports.
2. Define the prediction timestamp and what information is legally available then.
3. Specify target semantics, units, aggregation, horizon, and update cadence.
4. Distinguish event time from ingestion and processing time.
5. Identify known-future, observed-past, static, and unavailable covariates.
6. Define entities, grouping, hierarchy, and cold-start behavior.
7. Document latency, cost, interpretability, and reliability constraints.
8. Establish naive and business-rule baselines.
9. Define temporal train/validation/test boundaries.
10. Choose metrics tied to operational loss, not convenience.
11. Record failure handling and fallback behavior.
12. Confirm the formulation with domain and production stakeholders.

## Decision points
- Prefer forecasting when a future numeric path is required; use temporal classification when the business outcome is categorical.
- Prefer direct multi-horizon models when horizon-specific behavior matters; recursive approaches may be simpler but accumulate error.
- Use point forecasts only when uncertainty is irrelevant; otherwise require intervals or distributions.

## Common failure patterns
- Predicting a target unavailable at the assumed latency.
- Ambiguous timestamp or timezone definitions.
- Mixing multiple horizons into one metric without business justification.
- Ignoring cold-start entities.
- Selecting a complex model before establishing naive baselines.

## Verification
The formulation is verified when another engineer can reconstruct exactly what is predicted, at what time, from which information, for which horizon, and how success is measured without hidden assumptions.

## Expected output
A time-series problem specification containing target, timestamps, horizon, cadence, covariate availability, splits, baselines, metrics, constraints, and fallback behavior.

## Stop conditions
Stop and escalate if target timing cannot be established, required features are not available at inference time, timestamp semantics are unreliable, or no evaluation window represents deployment conditions.