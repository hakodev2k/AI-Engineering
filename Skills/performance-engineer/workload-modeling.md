# Workload Modeling

## Purpose
Build realistic workload models so benchmarks and capacity decisions represent production behavior rather than synthetic traffic that produces misleading results.

## When to use
Use before load tests, capacity forecasts, architecture comparisons, scaling changes, or performance experiments.

## Inputs
Production telemetry, traffic forecasts, endpoint or operation mix, payload distributions, user concurrency, geographic patterns, scheduled jobs, and dependency behavior.

## Context to inspect
Inspect arrival rates, think time, burstiness, read/write ratios, hot keys, session behavior, cache state, data volume, request fan-out, and background work.

## Core knowledge
A useful workload model describes both volume and shape. Closed and open workload models behave differently. Uniform random traffic often misses hotspots, coordinated bursts, long-tail payloads, and correlated operations.

## Procedure
1. Define the production scenario being modeled.
2. Extract representative operation frequencies and arrival patterns.
3. Model concurrency and user think time where applicable.
4. Capture payload and data-size distributions.
5. Include hot partitions, popular objects, and skew.
6. Model cache warm/cold behavior deliberately.
7. Include background and scheduled workloads that compete for resources.
8. Represent dependency latency and quotas.
9. Define normal, peak, burst, and stress variants.
10. Compare generated workload telemetry with production distributions.
11. Version the model with assumptions and source evidence.

## Decision points
Prefer replay or sampled production distributions when privacy and tooling permit. Use synthetic models when production evidence is unavailable, but label assumptions explicitly.

## Common failure patterns
Testing a single endpoint repeatedly, uniform payloads, unrealistic zero think time, omitting writes or background work, warming caches unintentionally, and using request count without arrival-rate reasoning.

## Verification
Compare operation mix, rate, concurrency, payload distribution, cache behavior, and resource contention against the intended production scenario.

## Expected output
A documented, reproducible workload profile usable by benchmark and load-test tooling.

## Stop conditions
Stop when production data cannot be used safely, the target scenario is undefined, or assumptions are too uncertain to support a decision.