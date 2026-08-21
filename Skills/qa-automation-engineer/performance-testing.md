# Performance Testing

## Purpose
Design reproducible performance experiments that reveal capacity, latency, throughput, and degradation risks before production.

## When to use
Use for critical APIs, batch jobs, high-traffic workflows, scaling changes, database changes, or explicit SLOs.

## Inputs
Workload model, SLOs, architecture, production-like data, infrastructure limits, observability.

## Context to inspect
Traffic shape, concurrency, payload sizes, caches, database, dependencies, autoscaling, warm-up, quotas, and background work.

## Core knowledge
Performance results are meaningful only relative to a workload and environment. Measure distributions (p50/p95/p99), throughput, errors, saturation, and resource utilization together.

## Procedure
1. Define hypotheses and pass/fail SLOs.
2. Model realistic request mix and arrival pattern.
3. Prepare representative data and environment.
4. Establish baseline after warm-up.
5. Run load, stress, spike, or endurance tests according to risk.
6. Correlate latency/errors with CPU, memory, GC, DB, network, and dependency metrics.
7. Change one significant variable at a time.
8. Repeat to establish confidence.
9. Document bottleneck and safe operating range.
10. Add lightweight performance regression checks where stable.

## Decision points
Use production-like environments for capacity claims; microbenchmarks for isolated code hypotheses. Avoid extrapolating from developer machines.

## Common failure patterns
Average latency only, unrealistic constant traffic, cold-start contamination, no server metrics, testing an already saturated shared environment, declaring improvement from one run.

## Verification
Repeat baseline and candidate runs, compare percentile distributions and resource saturation, and confirm results meet stated SLOs.

## Expected output
Evidence-backed capacity/performance findings and bottleneck recommendations.

## Stop conditions
Stop when environment contention or missing telemetry makes conclusions unreliable.