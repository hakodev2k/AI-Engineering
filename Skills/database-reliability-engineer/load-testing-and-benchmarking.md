# Load Testing and Benchmarking

## Purpose
Measure database behavior under representative load to validate capacity, changes, and failure-mode performance.

## When to use
Use before launches, migrations, scaling changes, major query/schema changes, or when capacity assumptions need evidence.

## Inputs
Production workload characteristics, data distributions, concurrency, SLOs, topology, and candidate changes.

## Context to inspect
Traffic mix, hot keys, read/write ratio, transaction sizes, cache state, connection behavior, and background jobs.

## Core knowledge
Synthetic throughput without workload fidelity can mislead. Tail latency, saturation, queueing, and failure recovery matter more than peak transactions per second alone.

## Procedure
1. Define the decision the test must support.
2. Build representative data volume and distribution.
3. Reproduce workload mix and concurrency.
4. Establish a baseline.
5. Ramp load gradually through expected peak and headroom.
6. Measure latency percentiles, errors, waits, CPU, memory, IO, locks, and connections.
7. Test degraded states such as replica loss where relevant.
8. Repeat candidate changes under identical conditions.
9. Document limits and confidence bounds.

## Decision points
Use replay when production traces can be safely sanitized; use synthetic workloads when controlled isolation is more important.

## Common failure patterns
Tiny datasets, warm-cache-only tests, unrealistic concurrency, comparing different environments, and optimizing only throughput.

## Verification
Ensure repeatable runs, stable baselines, representative bottlenecks, and metrics tied to acceptance criteria.

## Expected output
Benchmark evidence, saturation points, headroom estimate, and supported engineering decision.

## Stop conditions
Stop if test data is unsafe, environment differs materially from target, or generated load could affect production.