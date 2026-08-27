# Network Capacity Planning and Resilience

## Purpose
Forecast network demand and engineer sufficient capacity and redundancy for expected growth and credible failures.

## When to use
Use for annual planning, new applications/sites, circuit upgrades, cloud growth, redundancy review, or chronic saturation.

## Inputs
Historical traffic, percentiles/peaks, growth forecasts, application launches, circuit/device capacities, redundancy topology, SLOs, and lead times.

## Context to inspect
Interface/queue utilization, flow composition, oversubscription, burst behavior, backup-path capacity, hardware forwarding limits, licensing, provider lead time, and seasonal events.

## Core knowledge
Plan for failure-state capacity, not only normal-state averages. Percentiles are useful but must be paired with burst and business-event analysis. Redundancy is ineffective when components share power, fiber, provider, control plane, or capacity bottlenecks.

## Procedure
1. Inventory capacity by critical link, device, tunnel, queue, and service.
2. Establish clean historical baselines and peak periods.
3. Separate sustained growth from anomalies and one-time events.
4. Attribute major traffic classes using flow telemetry.
5. Model expected organic and project-driven growth.
6. Model N-1 and relevant multi-failure scenarios.
7. Calculate headroom against operational thresholds.
8. Identify hardware, license, provider, and physical bottlenecks.
9. Rank upgrades by exhaustion date, impact, lead time, and cost.
10. Validate backup paths can carry failover load.
11. Set proactive utilization and forecast alerts.
12. Revisit assumptions after major workload changes.

## Decision points
Upgrade capacity when demand is durable; optimize routing/QoS when imbalance or class contention is causal. Scale out when it improves failure domains and economics; scale up when operational simplicity dominates.

## Common failure patterns
Using monthly averages, ignoring backup-path overload, assuming line rate equals usable forwarding capacity, missing cloud egress/processing limits, and ordering circuits after exhaustion.

## Verification
Backtest forecasts, validate measured post-upgrade headroom, simulate or test failover load, and confirm no hidden bottleneck moves downstream.

## Expected output
Capacity forecast, exhaustion dates, resilience scenarios, prioritized investments, assumptions, and monitoring thresholds.

## Stop conditions
Escalate when telemetry quality is insufficient, business forecasts are unavailable for material demand, or required resilience exceeds feasible budget/architecture.