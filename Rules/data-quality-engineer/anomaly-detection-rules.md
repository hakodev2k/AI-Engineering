# Anomaly Detection Rules
## Purpose
Detect unexpected changes without confusing normal variation with defects.
## Scope
Distribution shifts, volume changes, categorical drift, and time-series anomalies.
## MUST
- Anomaly methods MUST document baseline, sensitivity, seasonality assumptions, and monitored dimensions.
- Alerts MUST be evaluated for false-positive and false-negative operational cost.
- Significant anomalies MUST be corroborated with source or pipeline evidence before broad corrective action.
## MUST NOT
- MUST NOT treat every statistical anomaly as a data defect.
- MUST NOT silently retrain baselines across unresolved incidents.
## SHOULD
- Detection SHOULD combine statistical signals with deterministic invariants.
## Exceptions
Adaptive thresholds require bounded change controls and auditable history.
## Verification
Review detection configuration, backtests, alert precision, baseline changes, and incident outcomes.