# Distributed Protocol Verification

## Purpose
Verify distributed protocols under asynchronous communication, partial failure, duplication, reordering, retries, and recovery.

## When to use
Use for consensus-adjacent coordination, leader election, replication, leases, distributed locks, sagas, messaging protocols, and cross-service workflows.

## Inputs
Protocol description, node state, message types, delivery guarantees, failure model, timing assumptions, and safety/liveness requirements.

## Preconditions
The network and failure assumptions must be stated explicitly.

## Context to inspect
Retries, idempotency, clocks, leases, persistence, membership changes, partitions, crash recovery, duplicate messages, and stale replicas.

## Core knowledge
Distributed correctness is constrained by failure and timing models. Safety should generally survive arbitrary delay, while liveness often depends on eventual synchrony, fairness, or availability assumptions. Exactly-once behavior usually decomposes into weaker transport guarantees plus application invariants.

## Procedure
1. Define nodes, durable state, volatile state, and messages.
2. Specify message send, receive, loss, duplication, and reordering semantics.
3. Define crash, restart, partition, and recovery transitions.
4. State quorum, ownership, fencing, or epoch invariants where relevant.
5. Separate safety properties from progress properties.
6. Model stale reads, delayed messages, and concurrent leaders.
7. Explore small topologies exhaustively before increasing size.
8. Test membership and failover transitions.
9. Analyze counterexamples against operational assumptions.
10. Trace protocol guarantees to implementation controls and monitoring.

## Decision points
Model real-time bounds only when the platform can enforce them. Prefer fencing tokens over time-only exclusion when stale actors can continue executing.

## Common failure patterns
Assuming reliable FIFO delivery, ignoring durable-state recovery, treating retries as harmless, confusing uniqueness with exactly-once execution, and embedding hidden clock assumptions.

## Verification
Check safety across partitions and crashes, verify progress under documented fairness/timing assumptions, and reproduce counterexample message schedules in simulation where possible.

## Expected output
A verified protocol model, explicit assumptions, properties, counterexamples, and implementation obligations.

## Stop conditions
Stop when failure semantics are unspecified, liveness depends on unjustified timing assumptions, or the model omits durability behavior required for recovery.