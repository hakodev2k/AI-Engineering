# Build Performance Profiling

## Purpose
Diagnose build latency using evidence from the critical path, action execution, scheduling, I/O, and caching.

## When to use
Use when clean or incremental builds miss latency targets or regress after build-system changes.

## Inputs
Build traces, action timings, CPU/memory/I/O metrics, cache telemetry, dependency graph, worker utilization, and baseline revisions.

## Context to inspect
Inspect critical path, parallelism, queueing, compiler phases, linking, code generation, filesystem behavior, dependency scanning, cache transfers, and startup overhead.

## Core knowledge
Total CPU time is not wall-clock critical path. Optimization should target serialized expensive work and frequent developer workflows. A faster action may not shorten the build if it is off critical path.

## Procedure
1. Define representative clean, no-op, and incremental scenarios.
2. Capture repeatable baselines with variance.
3. Record build traces and resource metrics.
4. Identify critical-path actions and idle gaps.
5. Separate execution, scheduling, dependency analysis, cache, and transfer costs.
6. Form one measurable hypothesis at a time.
7. Apply the smallest change that tests it.
8. Re-run multiple samples and compare distributions.
9. Check correctness and cache behavior after optimization.
10. Add regression budgets/telemetry for important scenarios.

## Decision points
Optimize critical-path latency for interactive workflows; optimize aggregate CPU/cost for CI throughput when that is the business constraint. Do not trade correctness for apparent no-op speed.

## Common failure patterns
Profiling one warm run, optimizing total work rather than critical path, disabling correctness checks, hiding time in pre-build scripts, and ignoring network/cache overhead.

## Verification
Provide before/after traces, multiple samples, percentile or variance data, unchanged outputs/tests, and evidence that the targeted scenario improved.

## Expected output
A ranked bottleneck analysis, validated optimizations, and regression metrics.

## Stop conditions
Stop when measurement noise exceeds the claimed gain, required profiling data is unavailable, or proposed changes alter correctness/security guarantees without approval.