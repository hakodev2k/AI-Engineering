# Observability Rules

## Purpose
Make data failures detectable, diagnosable, and attributable.

## Scope
Pipeline runs, data quality, freshness, volume, lineage, resource use, and consumer-impact signals.

## MUST
- Emit structured operational signals for critical pipeline state, failures, latency, freshness, and data volume.
- Correlate pipeline execution with datasets, code version, run identifiers, and relevant source checkpoints.
- Define alerts around actionable reliability symptoms rather than raw noise alone.
- Preserve enough diagnostic context to distinguish source, processing, storage, and downstream failures.

## MUST NOT
- Rely solely on success/failure job status for critical data observability.
- Log secrets or unnecessary sensitive record contents.
- Create alerts with no owner or defined response expectation.

## SHOULD
- Use dashboards that combine operational and data-quality signals.
- Track trends and error-budget consumption for important SLOs.

## Exceptions
Reduced telemetry requires documented reason, residual risk, and alternate evidence.

## Verification
Inspect logs, metrics, traces, dashboards, alert routes, correlation identifiers, and incident evidence.