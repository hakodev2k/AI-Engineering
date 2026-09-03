# Benchmark Methodology

## Purpose
Produce trustworthy inference benchmarks that support engineering and capacity decisions rather than misleading micro-optimizations.

## When to use
Use before comparing runtimes, hardware, quantization, batching, parallelism, or serving configurations.

## Inputs
Candidate configurations, representative workload distributions, target hardware, SLOs, correctness checks, and cost data.

## Context to inspect
Inspect warmup, model loading, cache state, prompt/output lengths, concurrency, request arrival pattern, clock/power settings, software versions, and background load.

## Core knowledge
Benchmarks must separate cold start, TTFT, inter-token latency, end-to-end latency, throughput, and saturation behavior. Results are valid only for the tested workload distribution and environment.

## Procedure
1. State the decision the benchmark must support.
2. Freeze model, runtime, driver, and hardware versions.
3. Define representative request-length and concurrency distributions.
4. Define correctness and numerical-tolerance checks.
5. Separate cold-start and steady-state tests.
6. Warm the system consistently where appropriate.
7. Run enough samples for stable percentile estimates.
8. Increase load through saturation to identify the capacity knee.
9. Record p50/p95/p99 latency, TTFT, token rate, errors, memory, and utilization.
10. Repeat runs to quantify variance.
11. Compare cost per successful request/token where relevant.
12. Publish raw conditions with conclusions.

## Decision points
Use synthetic microbenchmarks to isolate mechanisms, but production-like load tests for deployment decisions. Prefer percentile distributions over single summary numbers.

## Common failure patterns
Cherry-picking batch sizes, comparing different output lengths, ignoring warmup, no correctness checks, testing below saturation only, and publishing throughput without latency.

## Verification
A benchmark is verified when it is reproducible, conditions are documented, correctness passes, and repeated runs lead to the same practical conclusion.

## Expected output
Benchmark protocol, environment manifest, result tables, variance, and decision-oriented conclusion.

## Stop conditions
Escalate when configurations cannot be made comparable, representative workloads are unavailable, or environmental noise prevents reproducible measurements.