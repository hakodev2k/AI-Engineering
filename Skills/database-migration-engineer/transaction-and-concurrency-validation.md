# Transaction and Concurrency Validation

## Purpose
Prove that target transaction, locking, isolation, and concurrency behavior preserves application correctness.

## When to use
Use for engine changes, major version changes, topology changes, and any migration involving transaction semantics.

## Inputs
Application transaction boundaries, isolation levels, critical invariants, concurrency patterns, lock telemetry, retry logic, and target engine behavior.

## Core knowledge
Isolation-level names do not guarantee identical behavior across engines. Deadlocks, write conflicts, gap locks, snapshots, serialization failures, and lock escalation differ materially.

## Procedure
1. Identify correctness-critical concurrent workflows.
2. Document source transaction and isolation behavior.
3. Map target semantics explicitly.
4. Build concurrent tests for lost updates, write skew, duplicate creation, and deadlocks.
5. Test timeout and retry behavior.
6. Observe locks and wait graphs under load.
7. Validate idempotency of retried transactions.
8. Adjust transaction scope, constraints, or concurrency control.
9. Repeat at production-like concurrency.
10. Add regression tests for discovered hazards.

## Decision points
Prefer optimistic concurrency for low-conflict workloads; use stronger locking when invariants require serialization and contention cost is acceptable.

## Common failure patterns
Assuming ORM defaults are safe, retrying non-idempotent transactions, long transactions, and fixing deadlocks by arbitrary retry loops.

## Verification
Concurrent tests preserve invariants and remain within latency/error thresholds.

## Expected output
Validated transaction semantics and explicit concurrency controls.

## Stop conditions
Stop when a business invariant cannot be guaranteed under target concurrency semantics.