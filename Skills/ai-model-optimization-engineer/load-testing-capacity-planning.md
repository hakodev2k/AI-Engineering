# Load Testing and Capacity Planning

## Purpose
Translate optimized model behavior into safe production capacity, scaling, and overload limits.

## When to use
Before launch, after model/runtime/hardware changes, or when traffic growth threatens SLOs.

## Inputs
Traffic distributions, SLOs, serving topology, model/runtime, hardware, autoscaling behavior, cost targets.

## Preconditions
Use isolated or approved environments with production-like limits and telemetry.

## Context to inspect
Inspect arrival burstiness, request sizes, queueing, batcher, replicas, startup time, autoscaling, rate limits, dependencies, and failure behavior.

## Core knowledge
Saturation is nonlinear: queueing drives tail latency sharply near capacity. Sustainable capacity must include failure and scaling headroom, not benchmark maximum throughput.

## Procedure
1. Define workload models and success criteria.
2. Establish steady-state load at low utilization.
3. Ramp until first SLO/resource saturation.
4. Run burst, soak, and mixed-shape tests.
5. Measure p95/p99, queue depth, throughput, errors, memory, utilization, and cost.
6. Test autoscaling lag and cold capacity.
7. Test one-replica/device loss where appropriate.
8. Set safe per-replica capacity below the knee.
9. Calculate headroom and scaling thresholds.
10. Document overload shedding/backpressure behavior.

## Decision points
Scale out before saturation when queueing SLOs dominate; optimize batching/utilization first when resources are underused.

## Common failure patterns
Constant-rate-only tests, average latency, no soak test, capacity at 100% utilization, ignoring cold starts and dependency limits.

## Verification
Repeated tests demonstrate sustainable SLO-compliant capacity plus required failure/traffic headroom.

## Expected output
Capacity envelope, scaling thresholds, load-test evidence, bottlenecks, and overload policy.

## Stop conditions
Stop if tests threaten shared production systems or representative traffic/resource limits cannot be reproduced.