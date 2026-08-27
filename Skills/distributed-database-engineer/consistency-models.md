# Consistency Models

## Purpose
Design and review data consistency guarantees in distributed databases without assuming stronger semantics than the system actually provides.

## When to use
Use for datastore selection, cross-node invariants, replication design, stale-read incidents, and correctness reviews.

## Inputs
Business invariants, read/write paths, topology, database guarantees, latency and availability objectives.

## Context to inspect
Read architecture docs, schemas, transaction boundaries, replication settings, failure history, client retry behavior, and consistency-related tests.

## Core knowledge
Understand linearizability, serializability, snapshot isolation, causal and eventual consistency, session guarantees, CAP trade-offs, quorum behavior, and application-visible anomalies. A guarantee must be evaluated end-to-end, including caches and clients.

## Procedure
1. State each business invariant precisely.
2. Identify operations that can race across nodes or regions.
3. Document the database's actual guarantees for those operations.
4. Construct failure scenarios involving delay, partition, failover, and retry.
5. Determine the weakest consistency level that still preserves required invariants.
6. Add coordination only where correctness requires it.
7. Define observable symptoms of violated assumptions.
8. Implement deterministic concurrency and fault tests.
9. Record the chosen model and residual risks.

## Decision points
Prefer weaker consistency for latency and availability when stale or reordered state is acceptable. Require stronger coordination for uniqueness, irreversible state transitions, financial invariants, or other correctness-critical decisions.

## Common failure patterns
Assuming replicas are current, confusing serializability with linearizability, relying on wall-clock order, undocumented read-your-writes expectations, and treating eventual consistency as an implementation detail.

## Verification
Demonstrate invariants under concurrent operations, replica lag, failover, retry, and network partition simulations. Verification requires evidence, not merely successful implementation.

## Expected output
A documented consistency contract, justified configuration or design, tests, and explicit operational assumptions.

## Stop conditions
Escalate when required guarantees are unsupported, invariants are ambiguous, or satisfying correctness would materially change availability or latency commitments.