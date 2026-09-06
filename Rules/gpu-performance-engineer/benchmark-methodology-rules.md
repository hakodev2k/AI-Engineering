# Benchmark Methodology Rules

## Purpose
Make GPU performance results reproducible, comparable, and resistant to misleading measurement practices.

## Scope
Microbenchmarks, end-to-end benchmarks, warm-up, sampling, environment control, and result reporting.

## MUST
- Benchmarks MUST define workload, hardware, software versions, precision, concurrency, and measurement window.
- Warm-up behavior MUST be separated from steady-state measurement when caches, compilation, or clocks affect results.
- Comparisons MUST use equivalent correctness criteria and workload semantics.
- Repeated runs MUST be used when variance can materially change conclusions.
- Benchmark artifacts MUST retain enough metadata for independent reproduction.

## MUST NOT
- MUST NOT cherry-pick the best single run.
- MUST NOT compare unlike hardware or configuration without explicit normalization or disclosure.
- MUST NOT omit regressions in latency, memory, quality, or power while reporting a throughput gain.

## SHOULD
- SHOULD report confidence intervals or variance for noisy workloads.
- SHOULD automate benchmarks in controlled environments when practical.

## Exceptions
Exceptions require documented constraints and alternative reproducibility evidence.

## Verification
Inspect scripts, raw measurements, environment metadata, result aggregation, and independent reruns.