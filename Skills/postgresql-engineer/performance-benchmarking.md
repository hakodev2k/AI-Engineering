# Performance Benchmarking

## Purpose
Measure PostgreSQL performance changes with reproducible workloads and statistically meaningful comparisons.

## When to use
Use before/after tuning, upgrades, schema/index changes, hardware changes, or capacity decisions.

## Inputs
Target workload, latency/throughput objectives, dataset, environment, candidate change.

## Context to inspect
Hardware, PostgreSQL settings, cache state, connection concurrency, data scale/distribution, background maintenance and client bottlenecks.

## Core knowledge
A benchmark is useful only when it represents the target workload and controls confounders. Measure throughput plus latency percentiles, errors and resource saturation.

## Procedure
1. Define hypothesis and success criteria.
2. Reproduce realistic data size/distribution.
3. Establish stable environment and baseline.
4. Include warm-up and steady-state periods.
5. Test representative concurrency and query mix.
6. Capture p50/p95/p99 latency, TPS, errors and resource metrics.
7. Change one primary factor.
8. Repeat enough runs to identify variance.
9. Test overload behavior, not only happy path.
10. Document reproducible commands/configuration.

## Decision points
Use microbenchmarks for isolated mechanisms; workload benchmarks for production decisions. Test both warm and cold-cache scenarios when relevant.

## Common failure patterns
Tiny datasets, single-run conclusions, client bottleneck mistaken for database bottleneck, average latency only, benchmark settings unlike production.

## Verification
Another engineer should be able to reproduce the result within explained variance.

## Expected output
Benchmark protocol, raw measurements, comparison and decision recommendation.

## Stop conditions
Stop when environment differences invalidate the intended comparison or benchmark traffic risks production.