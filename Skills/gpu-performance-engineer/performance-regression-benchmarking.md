# Performance Regression Benchmarking

## Purpose
Build and operate GPU performance benchmarks that detect meaningful regressions without producing noisy or misleading alerts.

## When to use
Use before major kernel/runtime changes, when introducing new GPU architectures, in CI performance gates, or when investigating a reported slowdown.

## Inputs
- Representative workloads and shapes
- Historical performance data
- Hardware/software environment metadata
- Acceptable regression thresholds
- Correctness checks

## Context to inspect
Inspect warm-up, compilation, clock state, process isolation, input variance, concurrency, driver/runtime versions, library versions, and benchmark duration.

## Core knowledge
GPU benchmarks are sensitive to warm-up, clocks, thermal state, compilation caches, allocator state, and system contention. A useful regression test controls these factors and distinguishes practical effect size from statistical noise.

## Procedure
1. Select workloads that represent production-critical paths.
2. Define primary metrics and regression thresholds tied to user impact.
3. Record all relevant hardware and software versions.
4. Separate warm-up from measured iterations.
5. Run enough repetitions to characterize normal variance.
6. Use medians/percentiles or robust statistics rather than one run.
7. Compare only compatible environments unless normalization is explicit.
8. Couple performance tests with correctness validation.
9. On regression, bisect changes or dependencies while preserving environment.
10. Store raw measurements and metadata for auditability.
11. Periodically review benchmarks for representativeness and dead tests.

## Decision points
Use microbenchmarks for stable kernel-level signals and end-to-end benchmarks for customer impact. Gate CI only on tests with sufficiently low noise. Treat architecture changes as new baselines unless cross-device normalization is justified.

## Common failure patterns
- Single-run timing
- No warm-up
- Thresholds smaller than natural variance
- Comparing different GPU clocks or drivers
- Benchmarking obsolete shapes
- Performance gates without correctness gates

## Verification
Verify benchmark repeatability, controlled false-positive rate, sensitivity to known regressions, and agreement between benchmark movements and relevant production metrics.

## Expected output
A reproducible benchmark suite and regression policy with environment metadata, thresholds, historical baselines, and triage procedure.

## Stop conditions
Stop and revise the benchmark when variance overwhelms the desired threshold, workload representativeness is lost, or environment drift prevents valid comparison.