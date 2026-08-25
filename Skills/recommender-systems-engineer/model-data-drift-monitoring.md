# Model and Data Drift Monitoring

## Purpose
Detect when recommendation inputs, outputs, or user responses shift enough to invalidate model assumptions.

## When to use
Use for every production recommender and during incidents or market/product changes.

## Inputs
Feature distributions, scores, predictions, exposures, outcomes, model versions, and baseline windows.

## Context to inspect
Seasonality, launches, inventory changes, event schema changes, retraining cadence, and cohort mix.

## Core knowledge
Data drift, concept drift, label drift, and policy drift differ. Distribution change is a diagnostic signal, not proof of degraded utility. Monitor leading system signals and lagging outcome metrics together.

## Procedure
1. Define critical features, outputs, and outcomes.
2. Establish comparable baseline windows and seasonality handling.
3. Track missingness, cardinality, distribution, score, and exposure shifts.
4. Segment by important cohorts and candidate sources.
5. Correlate alerts with data/model/deployment changes.
6. Define severity thresholds and ownership.
7. Trigger retraining only when evidence supports it.
8. Review alert precision and retire noisy checks.

## Decision points
Use statistical distances for broad screening and business thresholds for actionable impact. Prefer retraining when concept changes; repair pipelines when data semantics changed.

## Common failure patterns
Alerting on harmless seasonality, no cohort monitoring, retraining corrupted data, threshold spam, and monitoring features without outcomes.

## Verification
Backtest alerts on known incidents, test synthetic shifts, and confirm runbooks identify owners and safe actions.

## Expected output
Actionable drift dashboards and alerts tied to diagnostic and remediation paths.

## Stop conditions
Stop automated remediation when drift source is unknown, data integrity is suspect, or retraining would amplify corruption.