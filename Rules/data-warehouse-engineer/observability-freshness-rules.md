# Observability and Freshness Rules

## Purpose
Make warehouse health, freshness, and data-product reliability visible and actionable.

## Scope
Applies to pipeline metrics, freshness, volume, latency, failures, SLIs, alerts, and operational dashboards.

## MUST
- Critical datasets MUST define freshness expectations and measurable service indicators.
- Alerts MUST identify the affected data product, severity, owner, and actionable evidence.
- Monitoring MUST distinguish no-data, stale-data, partial-load, and job-failure conditions where their impact differs.
- Operational conclusions MUST use available metrics, logs, lineage, and execution evidence.

## MUST NOT
- MUST NOT treat scheduler success as sufficient proof that a dataset is fresh and complete.
- MUST NOT create alerts with no actionable response path.

## SHOULD
- Monitor volume and distribution shifts for high-impact datasets.
- Alert thresholds SHOULD reflect business impact rather than arbitrary defaults.

## Exceptions
Temporary monitoring gaps require owner, risk statement, compensating checks, and expiry.

## Verification
Inspect dashboards, alert rules, incident examples, freshness measurements, and run history.