# Distributed Transactions

## Purpose
Choose and implement transaction strategies that preserve business invariants across distributed data boundaries.

## When to use
Use when workflows span shards, databases, or services and partial completion can create invalid state.

## Inputs
Business invariants, participants, failure modes, latency budget, compensation options, database transaction capabilities.

## Context to inspect
Current transaction boundaries, message flows, idempotency controls, schemas, retry behavior, and reconciliation processes.

## Core knowledge
Atomic commit protocols provide stronger coordination but can reduce availability and increase latency. Sagas trade atomicity for explicit intermediate states and compensation. Outbox/inbox patterns connect local transactions to messaging. Idempotency is required wherever retries can duplicate effects.

## Procedure
1. Express the invariant and acceptable intermediate states.
2. Minimize the number of distributed participants.
3. Determine whether a single data owner can remove the distributed transaction.
4. Compare native distributed commit, saga, outbox, and reconciliation approaches.
5. Define durable state transitions.
6. Make every retryable effect idempotent.
7. Define compensation semantics and irreversible boundaries.
8. Instrument transaction progress.
9. Test crashes after every durable step.
10. Provide repair tooling for stuck workflows.

## Decision points
Use atomic coordination when strict all-or-nothing semantics are mandatory and infrastructure supports it reliably. Prefer sagas when availability and service autonomy matter and compensating actions are valid.

## Common failure patterns
Dual writes, non-idempotent consumers, compensation that cannot restore invariants, hidden cross-shard transactions, and infinite retries.

## Verification
Inject failures between steps, duplicate messages, reorder delivery, and prove eventual terminal state plus invariant preservation.

## Expected output
A transaction protocol, state model, recovery rules, observability, and fault-injection evidence.

## Stop conditions
Escalate if required compensation is impossible, irreversible operations lack approval boundaries, or transaction semantics cannot preserve the stated invariant.