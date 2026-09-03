# Distributed Systems Properties Rules

## Purpose
Define and verify distributed-system properties under delay, reordering, duplication, partition, crash, and recovery behavior.

## Scope
Applies to replicated state, consensus, coordination, messaging, membership, leader election, distributed transactions, and fault-tolerant protocols.

## MUST
- Model network and process failures relevant to the claimed guarantee.
- State consistency, availability, durability, ordering, and convergence guarantees precisely.
- Distinguish safety from liveness under partitions and unavailable dependencies.
- Model duplicate, delayed, reordered, and lost messages when permitted by the transport.
- Verify recovery and membership transitions, not only steady-state protocol behavior.

## MUST NOT
- Assume reliable ordered delivery unless the production transport and protocol establish it.
- Claim exactly-once effects from delivery semantics alone.
- Hide quorum, clock, failure-detector, or synchrony assumptions.
- Generalize small-instance results without documenting symmetry or cutoff reasoning.

## SHOULD
- Model idempotency and deduplication explicitly when retries are possible.
- Use adversarial schedules and fault injection to validate formal assumptions against implementations.

## Exceptions
Stronger environmental assumptions require documented operational enforcement, detection mechanisms, and reviewer approval.

## Verification
Use model checking, trace analysis, fault injection, Jepsen-style testing where suitable, protocol logs, and review of assumption-to-deployment correspondence.