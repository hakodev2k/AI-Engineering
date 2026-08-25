# Read Replica and Routing Rules
## Purpose
Scale reads without violating consistency expectations or overloading replicas.
## Scope
Read replicas, follower routing, read/write splitting, and replica lag.
## MUST
- Classify reads by consistency requirement before routing them away from the writer.
- Monitor replica lag, apply rate, errors, and capacity.
- Define fallback behavior when replicas are stale or unavailable.
## MUST NOT
- Route read-after-write or correctness-critical reads to asynchronous replicas without an explicit consistency strategy.
- Assume replicas provide free capacity during failover or maintenance.
## SHOULD
- Load-balance reads using health and lag signals, not static availability alone.
## Exceptions
Eventually consistent workloads may tolerate bounded lag when the bound is documented and monitored.
## Verification
Inspect routing policy, consistency tests, lag telemetry, failover tests, and capacity models.