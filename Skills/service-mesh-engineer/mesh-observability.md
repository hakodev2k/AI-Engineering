# Mesh Observability

## Purpose
Build actionable metrics, logs and traces for mesh traffic while controlling cardinality and telemetry cost.

## When to use
Use for observability design, SLO instrumentation or telemetry gaps.

## Inputs
SLOs, traffic topology, telemetry backend limits, sampling policy and incident questions.

## Context to inspect
Proxy metrics, access logs, trace propagation, application telemetry, labels/tags and retention costs.

## Core knowledge
Proxy telemetry provides transport visibility but not business semantics. High-cardinality dimensions can destabilize monitoring systems. Traces require consistent context propagation and sampling.

## Procedure
1. Start from operational questions and SLOs.
2. Define golden signals per service and route.
3. Normalize service, cluster, zone and response-code dimensions.
4. Exclude unbounded identifiers from metric labels.
5. Configure access logs with privacy-aware fields.
6. Verify trace-context propagation through proxies and apps.
7. Select head/tail sampling based on incident needs and budget.
8. Build dashboards for control and data planes.
9. Create alerts on symptoms, not noisy implementation details.
10. Test telemetry during failure injection.

## Decision points
Prefer metrics for alerting, traces for causal paths and logs for detailed events. Increase sampling selectively rather than globally.

## Common failure patterns
Cardinality explosions, double-counting retries, missing route/version labels, sensitive data in logs and dashboards without actionable thresholds.

## Verification
Trace known requests end-to-end, reconcile proxy/application counts, validate alert firing and measure telemetry cost.

## Expected output
An observability contract and validated dashboards/alerts.

## Stop conditions
Escalate when privacy requirements are unclear or backend capacity cannot safely ingest planned telemetry.