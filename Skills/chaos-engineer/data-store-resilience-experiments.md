# Data Store Resilience Experiments

## Purpose
Validate application and data-layer behavior when databases, caches, replicas, or storage systems become slow, unavailable, partitioned, or inconsistent.

## When to use
Use for stateful services, database failover, read replicas, distributed caches, replication, or recovery mechanisms whose correctness matters during degradation.

## Inputs
Data architecture, consistency requirements, schema, transaction boundaries, replication topology, retry policies, cache semantics, RTO/RPO, and incident history.

## Preconditions
Backups and recovery procedures are valid, destructive operations are excluded unless explicitly approved, and correctness checks are available.

## Context to inspect
Primary/replica roles, failover, transaction isolation, connection pools, retry behavior, replication lag, cache invalidation, write ordering, idempotency, and data repair processes.

## Core knowledge
Availability without correctness is not resilience. Data-store experiments must evaluate lost, duplicated, stale, or reordered effects as well as latency and errors. Senior engineers distinguish transient transport failures from transaction outcome ambiguity and avoid retries that can duplicate non-idempotent writes.

## Procedure
1. Define the protected data invariants and user operation.
2. Establish baseline latency, replication lag, and correctness checks.
3. Select a non-destructive degradation mode.
4. Define expected application behavior and recovery.
5. Scope affected clients or replicas.
6. Execute within approved guardrails.
7. Observe connection pools, retries, transaction outcomes, and fallback reads.
8. Check invariants during and after the experiment.
9. Measure failover and reconnection time.
10. Confirm no repair backlog or stale cache remains.

## Decision points
Test replica lag when stale reads matter, primary unavailability when failover is claimed, and cache loss when cache independence is assumed. Avoid direct corruption unless a dedicated isolated environment and recovery objective justify it.

## Common failure patterns
Ambiguous write outcomes followed by unsafe retries; connection pool exhaustion; stale replica reads used for read-after-write flows; cache failover overwhelming the database; and recovery completing technically while invariants remain violated.

## Verification
Validate data invariants, user outcomes, recovery time, and post-recovery consistency using independent checks rather than relying only on service health.

## Expected output
Measured database resilience, correctness evidence, recovery characteristics, and remediation actions.

## Stop conditions
Stop if backups are unverified, data integrity cannot be measured, or the experiment could create irreversible production data loss.