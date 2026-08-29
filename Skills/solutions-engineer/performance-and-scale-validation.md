# Performance and Scale Validation

## Purpose
Validate that a proposed solution can meet throughput, latency, concurrency, and capacity requirements under representative conditions.

## When to use
Use when scale or responsiveness can determine technical acceptance.

## Inputs
Workload profile, latency targets, throughput, concurrency, data sizes, topology, limits, baseline measurements.

## Context to inspect
Peak versus average load, bottlenecks, quotas, autoscaling, caches, network paths, storage, dependencies, and warm-up behavior.

## Core knowledge
Performance is workload-specific. Averages hide tail latency and saturation. Capacity tests must separate client, network, dependency, and system bottlenecks.

## Procedure
1. Define measurable targets and workload model.
2. Establish a baseline.
3. Instrument critical resources and dependencies.
4. Run controlled load ramps.
5. Measure latency distributions, errors, saturation, and throughput.
6. Locate bottlenecks before tuning.
7. Retest changes under identical conditions.
8. Document capacity envelope and uncertainty.

## Decision points
Scale up when a single-node resource is limiting and economics fit; scale out when architecture supports parallelism and resilience benefits justify complexity.

## Common failure patterns
Testing unrealistic data, reporting averages only, changing multiple variables simultaneously, and confusing load-generator limits with system limits.

## Verification
Results are repeatable, instrumentation explains bottlenecks, and target percentiles meet agreed criteria.

## Expected output
An evidence-based performance envelope and scaling recommendation.

## Stop conditions
Stop when the environment or workload cannot represent the decision-critical conditions.