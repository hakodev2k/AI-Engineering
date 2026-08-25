# Connection Pooling Rules
## Purpose
Control PostgreSQL connection cost and preserve capacity under load.
## Scope
Client pools, proxies, session state, prepared statements, and connection limits.
## MUST
- Set pool sizes from database capacity and aggregate application replicas, not per-instance intuition.
- Account for pooling mode compatibility with session features and prepared statements.
- Reserve operational capacity for administration and recovery.
## MUST NOT
- Increase max_connections as the first response to saturation without evidence.
- Allow unbounded application connection growth.
## SHOULD
- Use pooling to smooth concurrency where workload semantics permit.
## Exceptions
Dedicated connections require documented operational need and capacity budget.
## Verification
Measure active/idle sessions, wait events, pool queueing, connection churn, and failure behavior at saturation.