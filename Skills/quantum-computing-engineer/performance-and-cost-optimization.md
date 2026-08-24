# Performance and Cost Optimization

## Purpose
Optimize end-to-end quantum workload latency, shot usage, circuit executions, classical overhead, and provider cost without degrading solution quality.

## When to use
Use when experiments or hybrid services are too slow, expensive, or queue-sensitive.

## Inputs
Execution traces, job metadata, shot counts, circuit metrics, provider pricing/limits, quality target, and classical baseline.

## Preconditions
A reproducible workload and quality metric exist.

## Context to inspect
Compilation time, queue time, execution duration, shot allocation, batching, measurement groups, optimizer calls, circuit depth, caching, and post-processing.

## Core knowledge
Quantum performance is end-to-end. Reducing gate count may not reduce wall time when queueing or repeated optimizer evaluations dominate. Cost should be normalized to achieved accuracy or decision quality.

## Procedure
1. Measure a baseline with stage-level timing and cost.
2. Identify the dominant cost/latency component.
3. Reduce avoidable circuit evaluations and duplicate submissions.
4. Group measurements when mathematically valid.
5. Tune shot allocation based on estimator variance.
6. Batch compatible workloads where provider semantics allow.
7. Cache deterministic compilation/preprocessing artifacts.
8. Reduce depth/two-qubit operations if hardware execution dominates.
9. Re-evaluate optimizer stopping criteria and evaluation budget.
10. Compare quality-adjusted cost before and after changes.
11. Preserve a simpler configuration when optimization gains are marginal.

## Decision points
Spend more shots when statistical error dominates; improve circuits when hardware noise dominates; improve orchestration when queue/API overhead dominates.

## Common failure patterns
Optimizing simulator runtime instead of production cost, reducing shots below useful precision, excessive batching that increases failure blast radius, and reporting cost without quality.

## Verification
Repeat representative workloads and compare latency, cost, calls, shots, and result quality with confidence intervals.

## Expected output
Measured bottleneck, optimized configuration, before/after evidence, trade-offs, and rollback criteria.

## Stop conditions
Stop when further optimization harms accuracy/reliability or savings are smaller than operational complexity.