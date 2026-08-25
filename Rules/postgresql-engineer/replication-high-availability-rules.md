# Replication and High Availability Rules
## Purpose
Provide predictable PostgreSQL failover while protecting data durability.
## Scope
Streaming/logical replication, replicas, synchronous settings, lag, promotion, and fencing.
## MUST
- Define acceptable data-loss and recovery targets before choosing replication durability settings.
- Monitor replication lag, WAL retention, slot health, and replica replay state.
- Ensure failover procedures prevent split brain and stale-primary writes.
- Rehearse promotion and application reconnection.
## MUST NOT
- Promote a replica without confirming topology and fencing implications.
- Treat an asynchronous replica as zero-data-loss protection.
## SHOULD
- Automate routine failover mechanics while retaining approval for high-risk topology changes.
## Exceptions
Emergency promotion follows incident authority and must be reconciled afterward.
## Verification
Run failover drills, inspect replication state, validate timelines, and test client recovery.