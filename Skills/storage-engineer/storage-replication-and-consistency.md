# Storage Replication and Consistency

## Purpose
Design replication that meets durability and recovery goals while making consistency, latency, and failure behavior explicit.

## When to use
Use for synchronous/asynchronous replication, metro/geo storage, DR design, replica lag incidents, and failover planning.

## Inputs
RPO/RTO, distance/latency, write rate, consistency requirements, bandwidth, failure domains, and application behavior.

## Context to inspect
Replication topology, acknowledgement semantics, lag metrics, journals/logs, fencing, failover automation, and dependency ordering.

## Core knowledge
Synchronous replication can provide near-zero data loss but adds write latency and availability dependencies. Asynchronous replication reduces foreground coupling but permits data loss equal to unreplicated changes. Failover correctness requires fencing and application-aware ordering.

## Procedure
1. Define acceptable data loss and outage duration.
2. Determine write acknowledgement semantics.
3. Measure network RTT and sustained/peak replication bandwidth needs.
4. Choose sync, async, or tiered replication.
5. Define lag thresholds and backlog recovery capacity.
6. Design fencing and split-brain prevention.
7. Establish failover/failback sequence and dependency order.
8. Test network partition and site loss.
9. Validate application consistency after promotion.
10. Document residual loss scenarios.

## Decision points
Use synchronous replication only when latency and failure coupling fit the SLO; use asynchronous replication for distance or latency tolerance with explicit RPO. Prefer application-consistent checkpoints when crash-consistent replicas are insufficient.

## Common failure patterns
Assuming replication equals backup, no fencing, insufficient catch-up bandwidth, hidden replica lag, circular dependencies, and untested failback.

## Verification
Measure actual lag, execute controlled failover/failback, verify application consistency and data reconciliation, and compare observed RPO/RTO with targets.

## Expected output
Replication topology, consistency contract, thresholds, failover runbook, and tested recovery evidence.

## Stop conditions
Escalate when fencing is unavailable, replication state is ambiguous, or promotion could create divergent writable copies.