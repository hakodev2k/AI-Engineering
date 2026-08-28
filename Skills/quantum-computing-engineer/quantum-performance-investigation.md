# Quantum Performance Investigation

## Purpose
Diagnose quantum workflow bottlenecks across circuit quality, sampling, classical optimization, compilation, queues, simulation, and provider execution.

## When to use
Use when experiments are slow, expensive, unstable, or fail to scale with instance size.

## Inputs
Timing metrics, circuit statistics, shot counts, optimizer traces, queue/runtime data, simulator profiles, cost records.

## Context to inspect
Depth, two-qubit count, measurement groups, batching, network/API overhead, transpilation time, classical callback cost, and retry behavior.

## Core knowledge
End-to-end quantum performance is hybrid. Faster circuits may not matter if queue, shots, or optimizer evaluations dominate.

## Procedure
1. Define the performance symptom and target metric.
2. Break total time/cost into workflow stages.
3. Measure before optimizing.
4. Identify the dominant component by contribution, not intuition.
5. Inspect circuit depth and routing overhead.
6. Inspect shot allocation and measurement grouping.
7. Profile classical optimization and simulation.
8. Measure provider queue, execution, and API latency separately.
9. Optimize one bottleneck at a time.
10. Re-measure quality as well as speed/cost.

## Decision points
Reduce depth when fidelity/execution dominates; reduce shots or evaluations when sampling dominates; batch asynchronously when orchestration dominates.

## Common failure patterns
Micro-optimizing SDK code while queue time dominates, reducing shots without uncertainty checks, and accepting faster but lower-quality results.

## Verification
Show before/after metrics on the same workload and confirm output-quality targets remain satisfied.

## Expected output
A bottleneck diagnosis and measured optimization result.

## Stop conditions
Stop when further gains require changing scientific requirements or provider/hardware capabilities outside scope.