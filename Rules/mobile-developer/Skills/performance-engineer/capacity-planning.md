# Capacity Planning

## Purpose
Translate workload forecasts and measured service capacity into resource, scaling, and headroom decisions that meet performance objectives economically.

## When to use
Use for growth planning, launches, infrastructure sizing, cloud cost reviews, migrations, and recurring capacity risk assessment.

## Inputs
Traffic forecasts, workload model, benchmark/load-test results, production utilization, SLOs, scaling behavior, quotas, and cost data.

## Context to inspect
Inspect per-instance throughput, saturation points, regional distribution, redundancy requirements, autoscaling lag, database/storage limits, quotas, and seasonal peaks.

## Core knowledge
Capacity is constrained by the first saturated resource, not aggregate CPU alone. Plan for failure scenarios and headroom, not just average demand. Horizontal scaling may not scale shared dependencies.

## Procedure
1. Define forecast horizon and normal/peak demand.
2. Establish measured capacity per service unit under SLO-compliant load.
3. Identify non-linear and shared bottlenecks.
4. Reserve headroom for bursts, failures, deployments, and scaling delay.
5. Model N-1 or required redundancy scenarios.
6. Check downstream, quota, network, and storage constraints.
7. Compare scale-up, scale-out, and efficiency improvements.
8. Estimate cost for candidate capacity plans.
9. Define scaling thresholds and capacity alerts.
10. Revalidate forecasts against actual growth periodically.

## Decision points
Scale out when workload partitions cleanly and shared dependencies can follow; scale up when coordination or licensing makes it more efficient; optimize first when waste materially changes economics.

## Common failure patterns
Sizing from average CPU, assuming linear scaling, ignoring failover capacity, no headroom for autoscaling lag, and forecasting requests without workload complexity.

## Verification
The plan must satisfy forecast peak and failure scenarios within SLOs, quotas, and budget using measured rather than theoretical capacity where possible.

## Expected output
A capacity model with assumptions, bottlenecks, headroom, scaling actions, and cost implications.

## Stop conditions
Escalate when forecasts or business growth assumptions are unavailable or capacity changes require budget approval.