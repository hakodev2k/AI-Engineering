# Replication Architecture and Operations

## Purpose
Design and operate MySQL replication for availability, read scaling, maintenance, and recovery.

## When to use
Use when building replicas, investigating lag, planning failover, or changing topology.

## Inputs
Topology, RPO/RTO, write rate, binlog settings, GTID status, replica metrics, workload characteristics.

## Context to inspect
GTID mode, binary log format, durability settings, replica parallelism, network latency, read routing, backup source, failover tooling.

## Core knowledge
Replication is asynchronous by default; replicas can lag and stale reads must be acceptable or routed appropriately. GTIDs simplify topology changes. Replication health is not equivalent to data correctness.

## Procedure
1. Define replication purpose and consistency expectations.
2. Map primary, replicas, regions, and failure domains.
3. Validate binlog/GTID and durability configuration.
4. Size replicas for sustained and catch-up load.
5. Configure parallel apply and monitoring appropriately.
6. Establish lag/error thresholds and runbooks.
7. Test replica rebuild and topology change.
8. Test failover and client reconnection behavior.
9. Validate post-failover data and replication chain.
10. Rehearse regularly.

## Decision points
Use replicas for eventually consistent reads only when product semantics allow. Choose semi-synchronous mechanisms when reduced loss window justifies latency/coupling.

## Common failure patterns
Routing read-after-write traffic to lagging replicas, ignoring replication errors, undersized replicas, fragile manual failover, and assuming zero lag means zero data divergence.

## Verification
Measure lag under peak load, perform controlled failover, validate GTID continuity, writes, reads, and replica rebuild.

## Expected output
Topology design, consistency contract, monitoring, and tested failover/rebuild runbooks.

## Stop conditions
Escalate on unexplained divergence, unsafe GTID state, insufficient recovery capacity, or failover that may lose acknowledged writes beyond accepted RPO.