# Metrics Instrumentation

## Purpose
Design reliable metrics for service health, workload behavior, capacity, and SLO measurement.

## When to use
Use when adding instrumentation, replacing weak dashboards, or building alertable service indicators.

## Inputs
Service behavior, SLOs, traffic model, telemetry SDK, metric backend, and cost/cardinality limits.

## Context to inspect
Inspect request paths, queues, dependencies, resource pools, failure modes, dimensions, aggregation behavior, and existing metrics.

## Core knowledge
Counters measure accumulated events, gauges current state, and histograms distributions. Labels multiply time series; uncontrolled cardinality can make a metrics platform unusable. Latency should normally be measured as distributions rather than averages.

## Procedure
1. Define questions and service indicators.
2. Choose metric types matching each phenomenon.
3. Define units and semantic names.
4. Select bounded, operationally useful dimensions.
5. Instrument success, failure, latency, throughput, saturation, and backlog where relevant.
6. Validate aggregation and reset behavior.
7. Test dashboards and alert queries.
8. Measure resulting series cardinality and ingestion cost.

## Decision points
Prefer a small stable metric set over detailed per-entity dimensions. Move unbounded identifiers to traces or logs.

## Common failure patterns
Averages hiding tail latency, user IDs as labels, ambiguous units, counters treated as gauges, duplicate metrics, and instrumentation without consumers.

## Verification
Generate controlled traffic and failures, compare expected counts and distributions with backend results, and confirm cardinality stays within budget.

## Expected output
Documented, bounded, SLO-useful metrics with validated semantics.

## Stop conditions
Escalate when metric semantics or backend aggregation behavior cannot be established.