# Storage Benchmarking

## Purpose
Design trustworthy storage benchmarks that predict workload behavior and expose limits without producing misleading headline numbers.

## When to use
Use for technology evaluation, migration validation, capacity planning, regression testing, or tuning.

## Inputs
Production workload characteristics, candidate systems, test environment, SLOs, datasets, benchmark tools, and resource limits.

## Context to inspect
Caching layers, compression, deduplication, background maintenance, network path, media state, filesystem settings, and platform throttles.

## Core knowledge
Benchmarks are valid only when request size, access distribution, concurrency, durability semantics, working-set size, and test duration resemble the target workload. Tail latency and steady state are critical.

## Procedure
1. State the question the benchmark must answer.
2. Capture production workload distributions.
3. Build a dataset larger than unintended caches when appropriate.
4. Define read/write mix, sequential/random pattern, concurrency, and durability mode.
5. Warm or cold start deliberately and label it.
6. Run long enough to reach steady state.
7. Record latency percentiles, IOPS, throughput, errors, throttling, and resource metrics.
8. Repeat runs and quantify variance.
9. Test saturation and recovery from overload.
10. Preserve commands, configuration, and environment metadata for reproducibility.

## Decision points
Use synthetic tools for controlled limits and replay/application tests for realism. Benchmark failure/rebuild states when production may operate there.

## Common failure patterns
Tiny datasets, short tests, disabled durability, hidden cache, incomparable environments, single-run conclusions, and reporting throughput without latency.

## Verification
A second operator should be able to reproduce results within explained variance. Cross-check benchmark behavior against observed production traces.

## Expected output
Reproducible test plan, raw results, percentile analysis, bottleneck notes, and recommendation tied to requirements.

## Stop conditions
Stop when environments are not comparable, critical benchmark parameters are unknown, or the test can corrupt/shared-impact production.