# Cost Efficiency

## Purpose
Ensure cache spend is justified by measurable workload value.

## Scope
Memory, compute, network, managed-service, replication, and operational cost.

## MUST
- Material cache capacity decisions MUST relate cost to measured working set, performance objectives, and origin savings.
- Replication and regional expansion MUST include both reliability value and recurring cost.
- Cost optimization MUST preserve required availability, security, and freshness.
- Unexplained growth in memory, traffic, or instance count MUST be investigated.

## MUST NOT
- Hit rate alone MUST NOT be used as a proxy for economic value.
- Cost reduction MUST NOT remove resilience headroom below approved requirements.
- Oversizing MUST NOT be retained indefinitely merely because it avoids capacity analysis.

## SHOULD
- Track cost per useful request, byte, workload, or tenant where meaningful.
- Remove low-value cache populations whose storage and invalidation costs exceed benefits.

## Exceptions
Document strategic headroom, expected duration, evidence, and review date.

## Verification
Inspect billing, utilization, working-set metrics, origin savings, forecasts, and capacity reviews.