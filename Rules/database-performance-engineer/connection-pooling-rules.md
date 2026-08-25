# Connection and Pooling Rules
## Purpose
Prevent connection management from exhausting database or application capacity.
## Scope
Client connections, pools, sessions, multiplexing, and connection lifecycle.
## MUST
- Size connection pools against database capacity, application concurrency, and failure behavior.
- Close or return connections deterministically according to the client library contract.
- Monitor active, idle, queued, failed, and exhausted connection states.
## MUST NOT
- Increase pool limits as the default response to queueing without bottleneck evidence.
- Create unbounded connection growth during retries or failover.
## SHOULD
- Use backpressure when demand exceeds safe connection capacity.
## Exceptions
Dedicated administrative or batch pools may use separate limits when isolation and resource budgets are explicit.
## Verification
Inspect pool configuration, database session counts, queue metrics, load tests, and failure-mode tests.