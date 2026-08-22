# Cost-Aware Capacity Planning

## Purpose
Plan future capacity so expected demand, resilience headroom, procurement lead time, and cloud economics are balanced explicitly.

## When to use
Use before launches, seasonal peaks, regional expansion, large migrations, capacity reservations, or sustained growth.

## Inputs
Demand forecast, utilization, SLOs, scaling limits, failure scenarios, pricing, commitments, quotas, service limits, procurement lead times.

## Context to inspect
Inspect peak concurrency, growth, failover capacity, autoscaling lag, provider quotas, scarce accelerators, regional availability, reserved capacity, and load-test evidence.

## Core knowledge
Capacity planning is not maximum-utilization planning. Required headroom depends on demand uncertainty, scaling speed, failure tolerance, and service limits. Cost should be evaluated per required reliability level.

## Procedure
1. Define demand drivers and planning horizon.
2. Establish current usable capacity and saturation points.
3. Model base, peak, and failure scenarios.
4. Include growth and seasonality uncertainty.
5. Determine required headroom from SLO and scaling behavior.
6. Identify quotas, regional constraints, and procurement lead time.
7. Compare on-demand, reserved, autoscaled, and pre-provisioned strategies.
8. Model cost for each scenario.
9. Validate assumptions with load tests or historical peaks.
10. Set review triggers as demand changes.

## Decision points
Pre-provision when scaling/ procurement latency exceeds tolerated risk. Use elastic capacity when demand uncertainty is high and provider limits permit it. Do not count failed-zone capacity as available in resilience scenarios.

## Common failure patterns
Planning from average traffic, ignoring quota lead time, buying commitments for peak demand, removing failover headroom, and using theoretical service limits without load tests.

## Verification
Load or historical evidence supports capacity assumptions; failure scenarios satisfy SLOs; cost model matches planned capacity; quotas are confirmed.

## Expected output
A capacity plan with demand scenarios, headroom, constraints, acquisition/scaling strategy, and cost forecast.

## Stop conditions
Escalate when demand forecasts, service limits, or reliability requirements are too uncertain for a safe commitment decision.