# Load Balancing Algorithms

## Purpose
Select and tune traffic-distribution algorithms that match workload cost, connection behavior, backend heterogeneity, and failure dynamics.

## When to use
Use when balancing is uneven, backends differ in capacity, long-lived connections dominate, or a new balancing tier is designed.

## Inputs
Per-backend capacity, request-cost distribution, connection duration, queue depth, latency, weights, health state, and traffic skew.

## Context to inspect
Inspect current algorithm, backend utilization, request and connection distribution, autoscaling behavior, slow-start support, persistence, and retry policy.

## Core knowledge
Round robin is simple but assumes comparable work. Least-connections can improve long-lived connection distribution but may misread heterogeneous request cost. Weighted methods represent unequal capacity. Hashing improves affinity and cache locality but can create hotspots. Power-of-two choices can provide strong distribution with low coordination.

## Procedure
1. Characterize request cost and connection lifetime distributions.
2. Determine backend homogeneity and scaling frequency.
3. Measure current imbalance by requests, connections, CPU, latency, and queues.
4. Identify affinity or cache-locality requirements.
5. Shortlist algorithms supported by the platform.
6. Model behavior during backend addition and removal.
7. Configure weights or slow start where justified.
8. Load test with realistic skew and failures.
9. Compare tail latency and utilization fairness.
10. Roll out progressively and observe redistribution.

## Decision points
Use weighted algorithms for heterogeneous capacity. Prefer least-load signals only when those signals correlate with actual work. Use consistent hashing when locality or affinity matters and tolerate controlled remapping.

## Common failure patterns
Optimizing request counts instead of resource cost; static weights after capacity changes; hashing on low-cardinality keys; no slow start; algorithm changes without retry analysis.

## Verification
Confirm backend utilization variance, tail latency, queue depth, error rate, and failover behavior improve under representative tests and production canaries.

## Expected output
A documented algorithm choice, parameters, evidence, rollback criteria, and monitoring plan.

## Stop conditions
Stop when workload cost cannot be measured, platform semantics are undocumented, or the proposed algorithm worsens failure concentration.