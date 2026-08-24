# Geospatial Observability

## Purpose
Instrument geospatial pipelines and services so data freshness, spatial quality, performance, and failures are diagnosable in production.

## When to use
Use for production ETL, spatial APIs, databases, tile pipelines, or long-running geospatial jobs.

## Inputs
Pipeline topology, SLAs/SLOs, quality thresholds, logs, metrics platform, tracing capabilities, incident history.

## Context to inspect
Inspect existing telemetry, dataset versions, job IDs, partition keys, spatial extents, retry behavior, and alert rules.

## Core knowledge
Operational health is not only job success. Geospatial systems also need visibility into freshness, coverage, geometry rejection, CRS errors, tile failures, spatial skew, and query latency.

## Procedure
1. Define service and data-quality indicators.
2. Emit dataset version, source, job, and partition identifiers.
3. Track record counts, rejected geometry counts, freshness, and spatial extent.
4. Measure spatial-query and tile-generation latency by workload class.
5. Add structured error categories for CRS, topology, IO, and provider failures.
6. Trace multi-stage processing where supported.
7. Build dashboards around user-impacting signals.
8. Alert on actionable thresholds rather than raw noise.
9. Correlate incidents with input versions and deployments.
10. Review telemetry cost and cardinality regularly.

## Decision points
Use high-cardinality spatial dimensions only when operational value justifies cost. Prefer sampled traces for high-volume paths and complete counters for critical failures.

## Common failure patterns
Job-success-only monitoring, coordinate values as metric labels, no lineage in logs, alerts without runbooks, and dashboards that hide stale data.

## Verification
Inject known failures, validate alerts, trace a dataset through stages, and confirm dashboards expose freshness and quality regressions.

## Expected output
Operational telemetry, dashboards, alerts, and diagnostic identifiers tied to spatial and data-quality risks.

## Stop conditions
Stop when telemetry would expose sensitive location data or monitoring cost/cardinality exceeds approved limits without redesign.