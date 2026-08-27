# Observability and SLOs

## Purpose
Make gateway health, traffic behavior, and policy effects measurable enough for reliable operations.

## When to use
Use when defining dashboards, alerts, SLOs, or diagnosing opaque gateway behavior.

## Inputs
Availability/latency objectives, route inventory, traffic classes, incident history.

## Context to inspect
Existing metrics, logs, traces, cardinality, sampling, error taxonomy, alert routing.

## Core knowledge
Track request rate, status classes, latency distributions, saturation, upstream timings, retries, throttles, auth failures, and config versions. Distinguish gateway-generated failures from upstream failures.

## Procedure
1. Define SLIs per critical traffic class.
2. Measure p50/p95/p99 latency and success rate at the gateway boundary.
3. Add upstream timing and gateway-processing dimensions.
4. Correlate requests with trace/request IDs.
5. Record policy outcomes without secrets.
6. Control metric label cardinality.
7. Alert on user impact and error-budget burn, not raw noise.
8. Build diagnostic views for route, region, upstream, and config version.

## Decision points
Use logs for detailed events, metrics for trends/alerts, and traces for causal latency paths. Sample intelligently rather than dropping all high-volume traces uniformly.

## Common failure patterns
High-cardinality user IDs in metrics, no distinction between 4xx causes, averages hiding tails, logging credentials, alerts without actionable context.

## Verification
Validate telemetry during load and injected failures; ensure dashboards explain known incidents.

## Expected output
Operational telemetry and SLOs that isolate gateway versus upstream problems.

## Stop conditions
Escalate if service objectives or ownership for alerts are undefined.