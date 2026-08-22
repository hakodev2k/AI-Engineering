# Performance Investigation

## Purpose
Investigate latency, throughput, CPU, memory, and dependency bottlenecks with a measurement-first workflow.

## When to use
Slow APIs/jobs, resource saturation, regressions, scaling problems, or capacity planning.

## Inputs
Symptoms, traces, metrics, profiles, workload, baseline, recent changes.

## Context to inspect
Latency percentiles, throughput, error rate, CPU, GC, allocation, thread pool, DB/dependency spans, queueing, infrastructure limits.

## Core knowledge
End-to-end latency is composed across queues, compute, DB, network, serialization, and downstream services. Average latency hides tails. Optimize the dominant constrained resource.

## Procedure
1. Define measurable symptom and baseline.
2. Reproduce with representative load if possible.
3. Decompose latency by traces/metrics.
4. Identify saturation or wait source.
5. Profile CPU/allocation only when indicated.
6. Form one testable hypothesis.
7. Make the smallest meaningful change.
8. Benchmark/load-test against baseline.
9. Check regressions and resource trade-offs.
10. Document evidence.

## Decision points
Scale only after identifying whether the workload scales horizontally; optimize code/query before capacity increases when a clear inefficiency dominates.

## Common failure patterns
Optimizing from intuition, only checking averages, benchmarking unrealistic data, changing several variables at once, ignoring downstream limits.

## Verification
Before/after percentile latency, throughput, resource usage, and regression tests.

## Expected output
Evidence-backed root cause and quantified improvement.

## Stop conditions
Escalate production load tests or infrastructure changes that may impact customers.