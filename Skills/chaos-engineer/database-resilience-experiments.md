# Database Resilience Experiments

## Purpose
Test application and database behavior during connection loss, latency, failover, lock contention, replica lag, and capacity pressure.

## When to use
Use for stateful services where database behavior dominates availability or correctness.

## Inputs
Database topology, connection settings, transaction model, failover configuration, workload, and RPO/RTO.

## Context to inspect
Inspect pools, command/connect timeouts, retry policies, transactions, replicas, indexes, lock behavior, and migration processes.

## Core knowledge
Database failures combine availability and correctness risks. Client retry behavior, transaction ambiguity, and connection-pool recovery deserve explicit testing.

## Procedure
1. Define the database failure and expected application behavior.
2. Protect data with representative non-destructive test scope.
3. Capture baseline latency, locks, connections, and replication.
4. Inject bounded latency, connection failure, failover, or contention.
5. Observe pools, retries, transactions, and user errors.
6. Restore service and inspect reconciliation/reconnection.
7. Verify data invariants and recovery objectives.

## Decision points
Use real failover tests when topology behavior matters; use proxies/stubs for precise client-policy tests. Avoid destructive storage faults unless isolated and explicitly approved.

## Common failure patterns
Retrying ambiguous writes, pool exhaustion, long transactions, stale replica reads, failover DNS surprises, and assuming successful reconnect means data correctness.

## Verification
Validate RTO/RPO, transaction outcomes, invariants, connection recovery, and user-facing SLOs.

## Expected output
Database resilience evidence and prioritized fixes.

## Stop conditions
Stop for irreversible data risk, uncontrolled lock impact, or replication divergence beyond approved limits.