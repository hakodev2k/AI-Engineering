# Scalability and Capacity Rules

## Purpose
Ensure feature infrastructure scales safely with entity count, feature count, traffic, and historical volume.

## Scope
Storage growth, online QPS, batch throughput, stream partitions, quotas, and failure-domain capacity.

## MUST
- Capacity plans MUST account for expected growth in entities, feature width, history, and serving traffic.
- Critical online services MUST include headroom for defined failure scenarios.
- Partitioning strategies MUST avoid predictable hotspots.
- Quotas and limits MUST be monitored before they become incident conditions.
- Scale tests MUST use data volume and skew representative of production.

## MUST NOT
- MUST NOT assume linear scaling when storage or partition architecture introduces bottlenecks.
- MUST NOT depend on emergency quota increases as the normal capacity strategy.
- MUST NOT co-locate workloads in ways that create unmeasured contention for critical serving paths.

## SHOULD
- Forecast storage and QPS at meaningful planning horizons.
- Test skewed keys and burst traffic.

## Exceptions
Temporary reduced headroom requires risk acceptance, owner, and expiry.

## Verification
Inspect forecasts, partition metrics, quota dashboards, load tests, and failure-domain capacity models.