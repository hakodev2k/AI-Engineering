# Compile-Time Performance

## Purpose
Measure and reduce compiler latency, CPU, memory, and scalability costs without sacrificing correctness or code quality blindly.

## When to use
Use for slow builds, memory spikes, pathological inputs, expensive passes, or release performance budgets.

## Inputs
Representative workloads, compiler profiles, timing/memory metrics, pipeline configuration, performance baseline.

## Context to inspect
Phase timers, CPU profiles, allocations, cache behavior, algorithmic complexity, repeated analyses, parallelism, incremental caches.

## Core knowledge
Compiler performance problems are often algorithmic or caused by repeated work. Optimize measured hot paths and preserve representative workload diversity. Throughput, latency, peak RSS, and generated-code quality can conflict.

## Procedure
1. Establish reproducible workload and baseline.
2. Separate front-end, optimization, backend, I/O, and linking costs.
3. Profile CPU and allocations.
4. Identify scaling behavior by input size.
5. Remove redundant work or improve asymptotic complexity first.
6. Introduce caching only with explicit invalidation and memory bounds.
7. Evaluate parallelism for contention and determinism.
8. Re-measure compile time, RSS, and code quality.
9. Add performance guardrails for regressions.

## Decision points
Trade optimization quality for compile time only according to mode/product goals. Cache expensive pure analyses when reuse is high and invalidation is trustworthy.

## Common failure patterns
Microbenchmark-only tuning, hidden quadratic behavior, unbounded caches, parallel contention, timing noise, compile-time wins that degrade runtime materially.

## Verification
Repeat benchmarks statistically, inspect profiles after changes, test large inputs, and compare generated-code metrics.

## Expected output
Measured improvement with no unexplained semantic or code-quality regression.

## Stop conditions
Stop when workload representativeness or baseline stability is insufficient to support a performance claim.