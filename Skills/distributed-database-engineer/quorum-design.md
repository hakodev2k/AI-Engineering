# Quorum Design

## Purpose
Configure and reason about read/write quorums so replicated data remains available and sufficiently consistent during failures.

## When to use
Use for quorum-based stores, replica-factor changes, latency tuning, and split-brain or stale-read investigations.

## Inputs
Replication factor, consistency requirements, node placement, failure assumptions, read/write latency targets.

## Context to inspect
Database quorum semantics, coordinator behavior, hinted handoff or repair mechanisms, topology, and observed failure modes.

## Core knowledge
Quorum labels are implementation-specific. Majority acknowledgement can protect against some failures but does not automatically imply linearizability. Intersections, failure detectors, leader/lease rules, and repair behavior matter.

## Procedure
1. Identify the exact operation semantics provided by the database.
2. Model replica sets and tolerated failures.
3. Calculate acknowledgement requirements for reads and writes.
4. Analyze quorum intersection during partitions and membership changes.
5. Include coordinator and leader failure behavior.
6. Measure latency impact of slow replicas.
7. Define degraded-mode policies.
8. Test concurrent writes and partition scenarios.
9. Document guarantees in application terms.

## Decision points
Increase acknowledgement strength for correctness and durability; relax it only when application semantics tolerate stale or lost updates and the availability gain is material.

## Common failure patterns
Applying generic R+W>N formulas without vendor semantics, counting unavailable replicas incorrectly, unsafe membership changes, and assuming quorum equals consensus.

## Verification
Run partition, slow-node, and concurrent-write tests; confirm acknowledged operations satisfy documented guarantees and expected availability.

## Expected output
Quorum configuration with a failure matrix, latency measurements, and explicit semantic guarantees.

## Stop conditions
Escalate when database documentation is ambiguous, membership is unstable, or proposed settings can acknowledge conflicting states.