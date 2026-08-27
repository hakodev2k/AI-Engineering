# Replication

## Purpose
Protect consistency and recovery expectations across replicated database systems.

## Scope
Physical, logical, synchronous, asynchronous, and cross-region replication.

## MUST
- Replication mode MUST be chosen from explicit durability, latency, and availability requirements.
- Replication lag, errors, slot or queue growth, and retention pressure MUST be monitored.
- Promotion procedures MUST establish that the candidate replica is sufficiently current for the accepted data-loss objective.
- Replication changes MUST account for bandwidth, storage, and source workload impact.

## MUST NOT
- MUST NOT promote a stale replica without acknowledging and approving the potential data loss.
- MUST NOT allow unbounded replication backlog to consume storage silently.
- MUST NOT assume logical replicas preserve every source-side behavior or object unless verified.

## SHOULD
- Replication paths SHOULD be exercised periodically.
- Cross-region replication SHOULD account for network partitions and prolonged isolation.

## Exceptions
Temporary lag or degraded replication requires an owner, impact assessment, alert suppression only when justified, and restoration deadline.

## Verification
Review replication state, lag history, error logs, promotion tests, retained-log growth, network capacity, and documented durability assumptions.