# Cache Observability

## Purpose
Build telemetry that explains cache value, health, correctness, and downstream impact rather than exposing only a global hit ratio.

## When to use
Use for production readiness, performance investigation, capacity planning, or incident response.

## Inputs
Cache topology, namespaces, SLOs, client/server metrics, tracing stack.

## Context to inspect
Inspect existing dashboards, metric cardinality, logs, traces, backend stats, and origin metrics.

## Core knowledge
Useful signals include hit/miss ratio by namespace, latency distributions, errors, timeouts, evictions, memory, fragmentation, connection saturation, fill latency, invalidation lag, hot keys, and origin amplification. High-cardinality key labels should not be exported naively.

## Procedure
1. Define questions operators must answer.
2. Instrument client hit/miss/error and latency.
3. Instrument fill and origin latency separately.
4. Collect server memory, CPU, network, connections, evictions, replication, and failover metrics.
5. Track invalidation and refresh lag.
6. Use sampled/top-K mechanisms for hot-key analysis.
7. Correlate cache spans with request traces.
8. Build SLO-oriented dashboards and actionable alerts.
9. Validate telemetry during load and fault tests.
10. Document metric semantics.

## Decision points
Alert on user impact or impending exhaustion, not every cache miss. Use logs/traces for high-cardinality diagnosis and metrics for aggregates.

## Common failure patterns
Global hit ratio only; average latency; raw key labels; alerts with no action; no origin correlation; metrics that disappear during cache failure.

## Verification
Reproduce known miss, eviction, hot-key, and failover scenarios and confirm dashboards reveal root cause.

## Expected output
Operational dashboards, alerts, trace coverage, and metric definitions.

## Stop conditions
Stop if telemetry would expose secrets/PII or cardinality cannot be bounded safely.