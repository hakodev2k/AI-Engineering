# Database Testing and Benchmarking

## Purpose
Validate database correctness and performance with reproducible tests that reflect production scale and concurrency.

## When to use
Use for query tuning, migrations, upgrades, index changes, capacity decisions, and regression protection.

## Inputs
Workload scenarios, data distributions, performance objectives, schema, candidate changes, test environment, and baseline metrics.

## Context to inspect
Inspect whether test data volume, skew, indexes, statistics, hardware/service tier, cache state, and concurrency resemble the target environment.

## Core knowledge
Single-run stopwatch measurements are weak evidence. Reliable database benchmarking controls variables, warms or deliberately clears caches, captures resource metrics, and tests distributions and concurrency.

## Procedure
1. Define the hypothesis and success metrics.
2. Capture a baseline before changes.
3. Build representative data volume and skew.
4. Select critical query and transaction scenarios.
5. Include cold/warm behavior deliberately where relevant.
6. Run repeated measurements and record distributions.
7. Test realistic concurrency and mixed workloads.
8. Capture plans, reads, CPU, waits, and elapsed time.
9. Compare alternatives under equivalent conditions.
10. Retain regression cases for important fixes.

## Decision points
Use microbenchmarks for isolated mechanisms and workload benchmarks for production decisions. Prefer production-like managed tiers when local hardware would distort conclusions.

## Common failure patterns
Tiny datasets, one execution, changing multiple variables, reporting averages only, and ignoring write or maintenance cost of an optimization.

## Verification
Ensure results are reproducible and improvements persist across representative parameter values and concurrent load.

## Expected output
A benchmark report with methodology, baseline, distributions, resource metrics, and decision rationale.

## Stop conditions
Stop when test conditions are too different from production to support the decision or measurement noise overwhelms the expected effect.