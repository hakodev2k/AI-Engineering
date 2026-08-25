# Replication and Consistency

## Purpose
Design replication with explicit consistency, ordering, lag, conflict, and failure semantics appropriate to application requirements.

## When to use
Use for multi-node, multi-site, or cloud replication and when diagnosing stale/divergent data.

## Inputs
Write/read patterns, consistency requirements, latency budget, topology, RPO, conflict model, and failure scenarios.

## Preconditions
Identify authoritative writers and whether the application can tolerate stale reads or conflicting writes.

## Context to inspect
Replica placement, quorum/witness, replication queues, lag metrics, network latency, promotion rules, snapshots, and application retry behavior.

## Core knowledge
Replication choices trade latency, availability, and consistency under failures. Acknowledgement semantics determine durability. Quorum alone does not solve every split-brain or application-level conflict.

## Procedure
1. Define required read/write guarantees.
2. Identify writers and promotion rules.
3. Map replicas to independent failure domains.
4. Choose sync/async and quorum semantics.
5. Define lag thresholds and backpressure.
6. Define fencing and conflict handling.
7. Test network partition, replica loss, and recovery.
8. Measure latency and data-loss windows.
9. Document client behavior during transitions.

## Decision points
Choose synchronous replication for near-zero data-loss requirements when latency permits. Choose asynchronous replication for distance/performance when bounded loss is acceptable. Multi-writer requires deterministic conflict semantics.

## Common failure patterns
Unfenced promotion, hidden lag, replicas sharing a failure domain, ambiguous acknowledgement guarantees, and failover tests that omit concurrent writes.

## Verification
Inject representative failures, verify acknowledged-write survival, measure lag, test promotion/fencing, and reconcile replicas after recovery.

## Expected output
A replication policy with guarantees, topology, thresholds, promotion rules, and failure-test evidence.

## Stop conditions
Escalate when required consistency conflicts with latency/availability goals or safe fencing cannot be guaranteed.
