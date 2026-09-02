# Analysis Performance Engineering

## Purpose
Diagnose and improve static-analysis latency, throughput, and memory without sacrificing correctness or materially degrading finding quality.

## When to use
Use when analyses exceed CI/IDE budgets, scale poorly on large repositories, consume excessive memory, or show unstable runtimes.

## Inputs
Profiles, traces, memory data, repository benchmarks, analysis counters, cache metrics, graph/domain sizes, and correctness suites.

## Preconditions
Establish reproducible workloads and baseline correctness, latency, throughput, and memory metrics.

## Context to inspect
Parsing, graph construction, fixed-point iterations, solver queries, summary generation, cache behavior, allocation hotspots, parallel execution, serialization, and dependency loading.

## Core knowledge
Analysis cost often grows with state cardinality, graph density, context count, solver complexity, or repeated work. Optimize measured bottlenecks rather than theoretical complexity alone. Precision-reducing optimizations require explicit quality evaluation.

## Procedure
1. Select representative small, median, and worst-case repositories.
2. Record wall time, CPU, peak memory, allocations, and analysis-specific counters.
3. Profile the dominant phases.
4. Determine whether growth comes from algorithmic complexity, repeated computation, state explosion, I/O, or contention.
5. Add targeted counters for contexts, joins, iterations, graph edges, and solver calls.
6. Optimize the highest-impact cause first.
7. Introduce memoization or incremental reuse with correct invalidation.
8. Reduce state cardinality only with measured precision impact.
9. Re-run correctness and finding-quality suites after every material change.
10. Add performance regression thresholds to CI.

## Decision points
Prefer algorithmic or caching improvements before lowering precision. Parallelize independent work only when contention, memory amplification, and determinism remain acceptable.

## Common failure patterns
Micro-optimizing cold paths, hiding work behind timeouts, unbounded caches, reducing precision without measurement, benchmark overfitting, and comparing noisy runs without controlled conditions.

## Verification
Confirm equivalent analysis results where semantics should be unchanged, measure multiple runs across repository sizes, inspect scaling curves, and validate memory under sustained workloads.

## Expected output
A measured performance improvement with preserved correctness, quantified quality trade-offs, and regression guards.

## Stop conditions
Stop when optimization would violate the analysis contract, benchmarks are not reproducible, or further improvement requires architectural changes beyond approved scope.