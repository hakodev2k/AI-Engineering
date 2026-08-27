# Data Durability and Recovery Rules

## Purpose
Ensure availability measures do not sacrifice durable, recoverable, and internally consistent data.

## Scope
Applies to databases, object stores, queues, caches with durable responsibilities, replication, backups, and stateful services.

## MUST
- Stateful systems MUST define recovery point and recovery time objectives aligned to business impact.
- Replication MUST NOT be treated as a substitute for independent recoverable copies when corruption or deletion can replicate.
- Recovery procedures MUST include integrity validation, not only service startup.
- Critical backup and restore paths MUST be tested on a defined cadence with measured recovery evidence.
- Failover designs MUST document consistency and acknowledged-write behavior during partitions and replica loss.

## MUST NOT
- MUST NOT claim durability from configured replication alone without validating actual replica health and recovery behavior.
- MUST NOT perform destructive recovery or reconciliation in production without authorized approval and a preserved recovery point when feasible.
- MUST NOT discard conflicting state silently.

## SHOULD
- Recovery tests SHOULD include realistic data volumes and dependency restoration order.
- Immutable or isolated recovery copies SHOULD be used for high-impact data where appropriate.

## Exceptions
A weaker recovery objective requires documented business acceptance, impact analysis, compensating controls, and review date.

## Verification
Inspect replication and backup telemetry, restore-test records, consistency checks, recovery measurements, and incident evidence. Demonstrate that stated RPO/RTO and integrity guarantees are achievable.