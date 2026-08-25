# Dashboard Observability and Data Freshness

## Purpose
Make production dashboards diagnosable and prevent stale, partial, or failed data from being mistaken for current truth.

## When to use
For operational dashboards, scheduled refreshes, embedded analytics, and high-value reporting.

## Inputs
Refresh pipeline, SLAs/SLOs, query logs, data timestamps, dependency graph, alerting capabilities.

## Core knowledge
Dashboard health includes data freshness, completeness, query success, render success, latency, and semantic version. A green application can still display stale data.

## Procedure
1. Define freshness and completeness expectations per critical dataset.
2. Expose last successful data timestamp separately from page load time.
3. Instrument query latency, errors, refresh duration, cache age, and render failures.
4. Track data-volume anomalies and missing partitions.
5. Propagate upstream failure states to the UI where material.
6. Define stale-data thresholds and user-visible status behavior.
7. Alert on sustained SLO violations rather than isolated noise.
8. Add correlation identifiers for troubleshooting.
9. Create runbooks for common refresh and query failures.
10. Review incidents and adjust telemetry gaps.

## Decision points
Fail visibly when stale data could cause harmful decisions; degraded display may be acceptable when age and limitations are explicit.

## Common failure patterns
Showing browser refresh time as data freshness; silent stale cache; monitoring only HTTP uptime; alerts without ownership; partial refresh presented as complete.

## Verification
Simulate stale, partial, failed, and slow dependencies and confirm telemetry, UI states, and alerts behave as specified.

## Expected output
Observable dashboard operations with freshness indicators, SLOs, alerts, and troubleshooting evidence.

## Stop conditions
Escalate when freshness cannot be derived reliably or upstream ownership prevents defining recovery expectations.