# ML Observability and Drift Detection

## Purpose
Detect production degradation in data, predictions, model quality and system behavior early enough to act.

## When to use
Use for every production model, especially where labels arrive late.

## Inputs
Production features, predictions, labels when available, training references, service telemetry and business KPIs.

## Context to inspect
Label delay, seasonality, expected population changes, feature ownership and incident history.

## Core knowledge
Data drift does not necessarily imply quality drift, and no drift metric alone proves harm. Monitoring must connect statistical signals to model and business outcomes.

## Procedure
1. Define service health metrics separately from ML health metrics.
2. Monitor schema, missingness, ranges and category changes.
3. Compare feature and prediction distributions to appropriate references.
4. Track delayed ground-truth quality when labels arrive.
5. Monitor calibration and slice performance where relevant.
6. Account for seasonality and known launches.
7. Set alert thresholds using historical variability and impact.
8. Link alerts to owners and runbooks.
9. Preserve samples and context for investigation.
10. Periodically validate that monitors detect known regressions.

## Decision points
Alert on actionable conditions, not every statistical difference. Retrain only when evidence indicates expected value exceeds retraining risk/cost.

## Common failure patterns
PSI-only monitoring, noisy alerts, no label-quality monitor, training set used forever as reference, and no model version in telemetry.

## Verification
Replay historical incidents or synthetic shifts and confirm detection, routing and diagnostic context.

## Expected output
Actionable dashboards, alerts and drift/quality investigation evidence.

## Stop conditions
Escalate when critical quality cannot be measured or unexplained high-impact drift persists.