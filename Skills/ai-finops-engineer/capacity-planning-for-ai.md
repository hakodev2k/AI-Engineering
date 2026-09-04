# Capacity Planning for AI

## Purpose
Plan accelerator and model-service capacity against forecast demand, reliability targets, delivery timelines, and cost constraints.

## When to use
Use for GPU clusters, inference fleets, batch pipelines, or provider quota planning when demand growth or scarcity can create either outages or expensive idle capacity.

## Inputs
- Historical and forecast workload demand
- Throughput and latency benchmarks
- SLOs and headroom targets
- Hardware/provider availability
- Pricing and commitment terms
- Deployment and procurement lead times

## Context to inspect
Inspect seasonality, traffic classes, training calendars, queue depth, concurrency, autoscaling behavior, regional limits, quotas, failure domains, and expected model changes.

## Core knowledge
Capacity planning balances expected demand, uncertainty, service headroom, and economic utilization. AI workloads often have lumpy training demand and latency-sensitive inference demand, so a single utilization target is misleading.

## Procedure
1. Segment workloads by latency, criticality, and elasticity.
2. Build demand forecasts with low/base/high scenarios.
3. Convert demand to hardware or API capacity using measured throughput.
4. Add reliability and failure-domain headroom.
5. Model acquisition lead time and quota constraints.
6. Compare on-demand, committed, reserved, spot, and burst-provider options.
7. Quantify idle-cost versus shortage-risk trade-offs.
8. Establish scaling thresholds and capacity review cadence.
9. Reserve capacity for known training milestones separately from inference baseload.
10. Validate forecasts against actual demand and reforecast regularly.

## Decision points
Use commitments for stable baseload, elastic capacity for uncertain peaks, and spot for interruption-tolerant work. Prefer multi-provider burst only when operational complexity is justified.

## Common failure patterns
Overprovisioning for theoretical peaks, ignoring procurement lead time, applying average utilization to bursty workloads, and failing to reserve capacity for critical launches.

## Verification
Compare forecast versus actual demand, utilization, queue time, SLO attainment, and stranded capacity. Investigate material variance.

## Expected output
A scenario-based capacity plan with required resources, timing, sourcing strategy, cost, and risk.

## Stop conditions
Stop when workload forecasts lack usable assumptions, critical quotas are unknown, or proposed capacity commitments exceed approved financial authority.