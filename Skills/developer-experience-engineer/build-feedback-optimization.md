# Build Feedback Optimization

## Purpose
Reduce the time developers wait for trustworthy build, test, lint, and validation feedback.

## When to use
Use when local or CI feedback loops are slow, flaky, redundant, or poorly targeted.

## Inputs
Build graph, timings, test suites, CI logs, cache metrics, dependency graph, and change patterns.

## Context to inspect
Inspect critical path, serialization, cache misses, repeated work, artifact transfer, test distribution, and cold versus warm performance.

## Core knowledge
Optimize measured critical paths. Faster feedback is valuable only if correctness and reproducibility remain strong.

## Procedure
1. Establish p50/p95 baseline by stage.
2. Identify critical-path work.
3. Remove duplicate or unnecessary steps.
4. Improve incremental builds and dependency boundaries.
5. Introduce safe caching with explicit keys.
6. Parallelize independent work within resource limits.
7. Split fast presubmit checks from slower assurance where appropriate.
8. Detect regressions continuously.

## Decision points
Cache deterministic outputs; avoid caching where invalidation cannot be trusted. Parallelize until resource contention outweighs gains.

## Common failure patterns
Optimizing averages only, stale caches, uncontrolled parallelism, skipping essential tests, and measuring pipeline duration without developer wait time.

## Verification
Compare p50/p95 end-to-end feedback time and failure accuracy on representative changes before and after optimization.

## Expected output
Measured bottlenecks, implemented optimizations, cache/parallelism rules, and regression monitoring.

## Stop conditions
Stop if optimization would weaken required validation, exceed infrastructure limits, or depends on unverified build determinism.