# Replication Rules
## Purpose
Use replicas safely for resilience, scaling, and recovery.
## Scope
Physical/logical replication, read replicas, lag, promotion, and consistency.
## MUST
- Define acceptable replication lag and consistency behavior for each replica use case.
- Monitor replication health, lag, errors, and retention dependencies.
- Test promotion and rejoin procedures before relying on replicas for recovery.
## MUST NOT
- Serve read-after-write or correctness-critical reads from asynchronous replicas without an explicit consistency strategy.
- Promote a replica during uncertainty without considering data loss and split-brain risk.
## SHOULD
- Isolate analytical or heavy read workloads when replicas can do so without violating freshness requirements.
## Exceptions
Temporary degraded replication requires documented impact and monitoring.
## Verification
Inspect lag metrics, topology, promotion tests, application routing, recovery points, and consistency tests.