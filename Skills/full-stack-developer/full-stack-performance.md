# Full-Stack Performance Investigation

## Purpose
Locate latency and resource bottlenecks across browser rendering, network, API, application runtime, database, and dependencies.

## When to use
Slow pages, poor Core Web Vitals, API latency, resource saturation, or regressions.

## Inputs
User symptoms, traces, browser profiles, metrics, logs, query plans, deployment context.

## Context to inspect
Frontend bundle/rendering, request waterfall, server traces, CPU/memory, downstream calls, database queries, caches.

## Core knowledge
End-to-end latency is cumulative and tail behavior matters. Optimize the dominant measured constraint, not the layer that is easiest to change.

## Procedure
1. Define user-visible performance target.
2. Reproduce with representative data and environment.
3. Capture an end-to-end timeline.
4. Partition time across browser, network, server, database, and dependencies.
5. Identify dominant bottleneck and causal evidence.
6. Form one optimization hypothesis.
7. Change the narrowest responsible layer.
8. Benchmark before and after.
9. Check resource use and regression risks.
10. Add monitoring for the improved path.

## Decision points
Reduce work before scaling resources. Cache only repeated work with acceptable staleness. Parallelize independent I/O only when downstream capacity supports it.

## Common failure patterns
Microbenchmarking irrelevant code, optimizing averages while p95 degrades, ignoring payload size, testing warm local environments only, and changing multiple variables at once.

## Verification
Compare p50/p95/p99, throughput, browser metrics, resource consumption, and error rate under representative load.

## Expected output
Evidence-backed diagnosis and measured improvement.

## Stop conditions
Escalate if reliable production-like measurements cannot be obtained.