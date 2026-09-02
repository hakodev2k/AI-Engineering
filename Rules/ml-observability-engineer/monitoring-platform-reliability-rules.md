# Monitoring Platform Reliability

## Purpose
Ensure the monitoring system remains trustworthy when production ML systems are degraded.

## Scope
Applies to collectors, pipelines, metric stores, log stores, trace systems, evaluation jobs, dashboards, and alert delivery.

## MUST
- Critical monitoring pipelines MUST expose freshness, ingestion failure, lag, dropped-data, and availability signals.
- Alert delivery paths MUST be tested independently of the services they monitor where feasible.
- Telemetry loss MUST be distinguishable from healthy zero activity.
- Capacity planning MUST account for expected ML traffic, cardinality, retention, and incident-time diagnostic load.

## MUST NOT
- MUST NOT interpret missing telemetry as a healthy metric value.
- MUST NOT allow an unbounded label or dimension to threaten monitoring availability without controls.
- MUST NOT make a single unaudited dashboard the only record of critical operational evidence.

## SHOULD
- Degrade gracefully by preserving high-value signals before low-value diagnostic detail.
- Monitor monitoring-system dependencies and quotas explicitly.

## Exceptions
Single points of failure require documented risk acceptance, recovery procedure, and alternative evidence source.

## Verification
Review platform SLOs, ingestion metrics, synthetic alert tests, quota settings, capacity tests, and telemetry-loss incident records.