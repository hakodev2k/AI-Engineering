# Database Transactions and Concurrency

## Purpose
Design safe write workflows under concurrent requests while minimizing locking and consistency failures.

## When to use
Multi-step updates, inventory/balance-like invariants, race conditions, duplicate processing, deadlocks, or concurrency exceptions.

## Inputs
Business invariants, write sequence, schema constraints, isolation requirements, contention profile.

## Context to inspect
Transaction boundaries, unique/FK constraints, concurrency tokens, isolation level, retry policy, lock/deadlock evidence.

## Core knowledge
ACID, isolation anomalies, optimistic vs pessimistic concurrency, row-version tokens, uniqueness as a correctness primitive, deadlocks, transaction duration, retry safety.

## Procedure
1. State invariants explicitly.
2. Prefer database constraints for enforceable invariants.
3. Minimize transaction scope and external calls inside it.
4. Choose optimistic concurrency for typical low-conflict workflows.
5. Use stronger locking only when contention/invariants require it.
6. Make retries conditional on idempotency and transient failure type.
7. Handle concurrency conflicts as domain outcomes where appropriate.
8. Test parallel execution.

## Decision points
Use optimistic concurrency when conflicts are rare and recoverable; pessimistic approaches when conflicting work must serialize and contention is acceptable.

## Common failure patterns
Long transactions, external HTTP inside transactions, retrying non-idempotent operations blindly, relying only on application checks for uniqueness, ignoring deadlocks.

## Verification
Parallel integration tests, constraint tests, deadlock/lock monitoring, invariant checks.

## Expected output
Short, explicit transaction boundaries with deterministic conflict handling.

## Stop conditions
Escalate isolation-level changes or cross-system atomicity requirements needing architecture review.