# Cloud Network Capacity Planning

## Purpose
Forecast and validate network capacity across bandwidth, packets, connections, routes, addresses, gateways, appliances, and provider quotas.

## When to use
Use before launches, migrations, seasonal peaks, regional expansion, or when saturation/exhaustion risk is emerging.

## Inputs
Historical traffic, growth forecasts, peak factors, topology, instance/service limits, quotas, failure scenarios, and SLOs.

## Preconditions
Use measured peak distributions rather than averages and include survivor-capacity requirements.

## Context to inspect
NIC bandwidth/PPS, NAT ports, LB connections, firewall throughput, transit limits, VPN/circuit bandwidth, route counts, IP utilization, endpoint quotas, and autoscaling behavior.

## Core knowledge
Capacity is multidimensional. Bandwidth headroom does not imply PPS, connection, port, route, or address headroom. Failure scenarios concentrate traffic and must be part of planning.

## Procedure
1. Inventory every constrained resource on critical paths.
2. Collect peak and percentile utilization.
3. Forecast growth with uncertainty bands.
4. Model launch/seasonal bursts and connection churn.
5. Model loss of a zone, appliance, circuit, or region.
6. Compare demand to hard/soft limits and quotas.
7. Define warning and action thresholds.
8. Request quota increases early.
9. Load-test bottleneck candidates.
10. Automate recurring capacity reports.

## Decision points
Scale vertically when provider units offer predictable headroom; scale horizontally when distribution improves capacity and resilience. Maintain larger buffers for slow-to-change external circuits/quotas.

## Common failure patterns
Planning on average traffic, ignoring failure redistribution, treating quotas as capacity, missing NAT/route/IP limits, and requesting increases only after deployment blocks.

## Verification
Validate forecasts against load tests or observed peaks, confirm quota approvals, and prove survivor capacity for required failures.

## Expected output
A capacity model, headroom dashboard, forecast, quota plan, and prioritized scaling actions.

## Stop conditions
Stop when traffic forecasts are unsupported, load tests threaten production, or provider hard limits require architecture redesign.