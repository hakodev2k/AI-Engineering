# Replication and Failover

## Purpose
Design replicated services and data stores that survive failures while maintaining understood consistency, durability, and recovery characteristics.

## When to use
Use for highly available databases, stateful services, multi-zone deployments, read replicas, and disaster-recovery architectures.

## Inputs
RPO/RTO, consistency requirements, failure domains, replication capabilities, topology, and workload characteristics.

## Context to inspect
Inspect synchronous/asynchronous replication, quorum rules, leader election, read routing, failover automation, backups, and DNS/service discovery behavior.

## Core knowledge
Replication is not backup. Synchronous replication reduces acknowledged-data loss but increases coordination latency. Asynchronous replication can lose recent writes during failover. Failover correctness depends on fencing and avoiding split brain.

## Procedure
1. Define tolerated failure domains and recovery objectives.
2. Map replication and acknowledgment semantics.
3. Define leader/primary ownership and election behavior.
4. Establish fencing or equivalent split-brain prevention.
5. Define read routing and stale-read expectations.
6. Plan automatic versus manual failover criteria.
7. Define failback and resynchronization.
8. Validate backup independence from replication.
9. Instrument replica lag, quorum health, role changes, and data divergence.
10. Run controlled failover exercises.

## Decision points
Use synchronous replication when durability requirements justify added latency. Use asynchronous replicas for distance/read scale when bounded data loss or stale reads are acceptable.

## Common failure patterns
Treating replicas as backups, automatic failover without fencing, no failback plan, and testing only process failure rather than network partition.

## Verification
Demonstrate failover under node, zone, and network faults; measure RPO/RTO and validate post-recovery consistency.

## Expected output
A replication/failover design with guarantees, failure handling, telemetry, and tested recovery.

## Stop conditions
Escalate when platform semantics are undocumented or required RPO/RTO cannot be met.