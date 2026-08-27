# Mesh Capacity Planning

## Purpose
Forecast control-plane, proxy and gateway capacity from workload growth and failure scenarios.

## When to use
Use before scale events, cluster growth, regional expansion or resource-budget changes.

## Inputs
Workload count, request rates, connections, config objects, churn, telemetry volume, growth forecast and SLOs.

## Context to inspect
Historical utilization, autoscaling, resource limits, control-plane push metrics, gateway saturation and node headroom.

## Core knowledge
Capacity is multidimensional: requests, concurrent connections, configuration fan-out, endpoint churn and telemetry can dominate different components. Failure capacity must include loss of zones or replicas.

## Procedure
1. Define forecast horizon and growth assumptions.
2. Establish current per-unit resource curves.
3. Identify limiting dimensions for proxies, gateways and control plane.
4. Model normal peak plus failure headroom.
5. Include certificate rotation and deployment churn peaks.
6. Validate autoscaler signals and lag.
7. Load test projected conditions.
8. Set warning and hard capacity thresholds.
9. Review cost and reserve strategy quarterly or after material change.

## Decision points
Scale vertically for per-proxy bottlenecks that cannot shard; scale horizontally for stateless gateway/control-plane capacity where convergence and dependency load remain safe.

## Common failure patterns
Planning from averages, ignoring connections/config churn, zero failover reserve, autoscaling on lagging metrics and node capacity insufficient for sidecars.

## Verification
Demonstrate projected peak and failure scenarios with bounded saturation and acceptable convergence.

## Expected output
A capacity model, thresholds and scaling actions.

## Stop conditions
Escalate when growth assumptions lack owners or representative load tests cannot be performed.