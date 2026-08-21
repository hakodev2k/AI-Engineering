# Latency and Tail Analysis

## Purpose
Diagnose why p95/p99 and worst-case user latency diverge from averages and identify the components responsible for tail amplification.

## When to use
Use when average latency looks healthy but users experience slowness, SLOs fail at high percentiles, or fan-out systems show unstable response times.

## Inputs
Latency histograms, distributed traces, request attributes, dependency timings, queue metrics, workload data, and error/retry telemetry.

## Context to inspect
Inspect request fan-out, queue waits, GC pauses, connection acquisition, lock contention, cold paths, retries, payload sizes, hot partitions, and downstream percentiles.

## Core knowledge
Percentiles are distributions, not additive values. Fan-out increases the chance that at least one dependency is slow. Coordinated omission and coarse aggregation can hide tails.

## Procedure
1. Confirm percentile calculation and measurement boundaries.
2. Segment latency by endpoint, operation, tenant, payload, region, and dependency.
3. Compare p50, p95, p99, and maximum trends.
4. Use traces to decompose service time versus waiting time.
5. Identify slow-path attributes and correlated resource events.
6. Inspect fan-out and retry amplification.
7. Check queues, pools, locks, and runtime pauses.
8. Form a causal hypothesis and isolate it experimentally.
9. Apply the smallest effective mitigation.
10. Re-measure the full distribution under equivalent load.

## Decision points
Optimize tails directly when user or SLO impact is percentile-based. Avoid sacrificing large amounts of throughput or cost for rare outliers unless their impact warrants it.

## Common failure patterns
Comparing averages, summing percentiles across services, mixing unrelated traffic populations, ignoring retries, and using sampled traces that systematically omit slow requests.

## Verification
The target percentile improves under the same workload without unacceptable regressions in throughput, errors, cost, or other latency segments.

## Expected output
A tail-latency root cause supported by segmented evidence and before/after distributions.

## Stop conditions
Escalate when telemetry aggregation prevents reliable percentile analysis or downstream timing evidence is unavailable.