# Performance Quality Validation

## Purpose
Validate performance requirements with representative workloads and evidence before users discover regressions.

## When to use
Use for latency-sensitive flows, capacity changes, high-volume releases, or performance regressions.

## Inputs
SLOs, workload model, architecture, telemetry, baseline results, environment capacity.

## Context to inspect
Inspect traffic distribution, concurrency, data volume, caches, downstream limits, resource saturation, and percentile latency.

## Core knowledge
Average latency hides tails. Performance tests need representative workload, warm-up, stable environments, and bottleneck telemetry. A faster test environment is not automatically representative.

## Procedure
1. Define measurable latency, throughput, and resource criteria.
2. Build a workload model from expected usage.
3. Establish a comparable baseline.
4. Control environment and data conditions.
5. Run load, stress, or endurance tests appropriate to risk.
6. Capture application and infrastructure telemetry.
7. Locate saturation and queueing behavior.
8. Compare distributions, not only averages.
9. Re-test after changes and record capacity margin.

## Decision points
Use production-like environments for capacity claims; use smaller environments for relative regression testing when scaling assumptions are validated.

## Common failure patterns
Unrealistic scripts, no warm-up, client bottlenecks, ignored errors, and optimizing without profiling.

## Verification
Results must be repeatable and tied to SLOs with telemetry explaining observed limits.

## Expected output
Performance evidence, bottlenecks, risk assessment, and capacity conclusions.

## Stop conditions
Stop if tests threaten shared systems or environment differences invalidate conclusions.