# Skill: Performance Diagnosis

## Purpose
Identify and correct backend performance bottlenecks using measurement rather than intuition.

## Trigger
Use for high API latency, throughput degradation, CPU/memory pressure, slow database access, thread-pool starvation, queue backlog, or rising dependency latency.

## Inputs
- Symptom, SLO/SLA impact, time window
- Metrics, traces, logs, profiler or APM data
- Request volume and representative workload
- Relevant code, queries, infrastructure limits

## Procedure
1. Define the metric that is unhealthy: p50/p95/p99 latency, RPS, error rate, CPU, allocation, GC pause, DB duration, pool saturation, queue age, or external dependency time.
2. Establish a baseline and affected time window.
3. Partition time by layer: network, middleware, application, database, cache, external calls, serialization, background work.
4. Identify the largest measurable contributor.
5. Form one testable hypothesis at a time.
6. Reproduce with representative data or load where safe.
7. Optimize the dominant bottleneck with the smallest justified change.
8. Measure again using the same metric and workload.
9. Check correctness, resource trade-offs, and regression risk.
10. Record before/after evidence and conditions under which the optimization matters.

## Common decision points
- Database: inspect query plan, indexes, round trips, projection, N+1, parameterization, locking.
- HTTP: reuse clients through `IHttpClientFactory`, apply explicit timeouts, avoid uncontrolled retries.
- Async: avoid blocking waits and unnecessary parallelism; propagate cancellation.
- Memory: inspect allocation sources before object pooling or caching.
- Cache: define freshness, invalidation, stampede behavior, and fallback before adoption.

## Outputs
- Bottleneck evidence
- Before/after measurements
- Change and tests
- Trade-off/risk record

## Verification
An optimization is accepted only if the target metric improves under comparable conditions without violating correctness or resource budgets.

## Stop conditions
Stop before production load testing, infrastructure resizing, cache-policy changes affecting business correctness, or costly capacity changes without required approval.
