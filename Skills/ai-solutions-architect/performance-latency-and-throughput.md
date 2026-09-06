# Performance, Latency, and Throughput

## Purpose
Design and tune AI solution performance against end-to-end latency, concurrency, throughput, and user-experience targets.

## When to use
Use during architecture sizing, performance review, scale testing, or when latency and throughput miss NFRs.

## Inputs
Traffic profile, concurrency, payload sizes, context lengths, model latency, retrieval latency, tool dependencies, streaming needs, and performance targets.

## Context to inspect
Inspect traces, percentile latency, token counts, queue depth, network path, retrieval timings, model/provider limits, caching, and peak versus average load.

## Core knowledge
End-to-end latency is additive across orchestration stages. AI latency is affected by input size, output length, model class, time to first token, generation rate, retrieval, tool calls, retries, and queueing. Optimize measured bottlenecks rather than individual components in isolation.

## Procedure
1. Define p50, p95, and p99 targets for critical journeys.
2. Decompose latency by stage using traces.
3. Measure time to first useful response and total completion time.
4. Analyze context and output token growth.
5. Parallelize independent work where correctness permits.
6. Reduce unnecessary model calls and serial tool hops.
7. Evaluate streaming, caching, batching, or asynchronous execution.
8. Load test realistic concurrency and payload distributions.
9. Measure rate-limit and queue behavior under peaks.
10. Re-test quality after each optimization.

## Decision points
Use streaming when early partial output improves experience; batching for throughput-oriented offline workloads; caching only for reusable results with acceptable staleness. Do not trade required quality for small latency gains without evidence.

## Common failure patterns
Optimizing averages instead of tail latency, oversized context, sequential independent calls, unrealistic load tests, and measuring provider latency without end-to-end user latency.

## Verification
Performance tests meet percentile latency and throughput targets under representative load without unacceptable quality or error regression.

## Expected output
A performance architecture and evidence report covering budgets, bottlenecks, capacity behavior, optimizations, and remaining risks.

## Stop conditions
Stop when workload assumptions are unavailable, production-like testing is impossible, or meeting targets would violate critical quality or safety requirements.