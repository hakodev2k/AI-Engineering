# Model Monitoring Rules

## Purpose
Detect degradation that infrastructure health alone cannot reveal.

## Scope
Covers production model quality, inputs, outputs, drift indicators, delayed labels, and decision-impact monitoring.

## MUST
- Production models MUST have monitoring tied to material failure modes and available ground truth.
- Input schema, missingness, range, and distribution anomalies MUST be monitored where they can invalidate predictions.
- Quality metrics MUST be computed when labels arrive, with delay explicitly understood.
- Alerts MUST have actionable thresholds, owners, and response guidance.
- Monitoring MUST segment critical cohorts when aggregate metrics could conceal harm.

## MUST NOT
- Absence of infrastructure errors MUST NOT be interpreted as proof of model quality.
- Drift scores MUST NOT automatically trigger retraining without validating that the drift is consequential.

## SHOULD
- Monitoring SHOULD compare candidate/current behavior and track confidence/calibration when meaningful.
- Dashboards SHOULD expose model version and feature/data version alongside metrics.

## Exceptions
If direct quality monitoring is impossible, documented proxy signals, periodic evaluation, and human review MUST provide compensating evidence.

## Verification
Inspect metric definitions, label joins, dashboards, alert routes, cohort coverage, model-version dimensions, and incident records. Test alert generation with controlled anomalies.