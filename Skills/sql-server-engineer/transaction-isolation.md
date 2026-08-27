# Transaction and Isolation Design

## Purpose
Choose SQL Server transaction boundaries and isolation semantics that preserve invariants while meeting concurrency requirements.

## When to use
Use when designing multi-statement writes, fixing race conditions, or evaluating READ COMMITTED SNAPSHOT/SNAPSHOT.

## Inputs
Business invariants, read/write sequences, concurrency model, failure behavior, schema, workload metrics.

## Context to inspect
Inspect transaction ownership, isolation defaults, connection settings, constraints, locking, row-versioning configuration, and retry semantics.

## Core knowledge
Atomicity does not automatically prevent write skew or lost-update patterns. Isolation level must match the invariant being protected. Database constraints remain a critical final correctness boundary.

## Procedure
1. State the invariant explicitly.
2. Identify concurrent interleavings that can violate it.
3. Minimize the transaction to the atomic unit.
4. Select isolation and locking behavior that prevents invalid interleavings.
5. Add constraints or concurrency tokens where appropriate.
6. Define retry behavior for transient conflicts.
7. Test concurrent executions and rollback paths.
8. Measure blocking/version-store impact.

## Decision points
Use optimistic versioning for read-heavy contention when conflict handling is acceptable; stronger locking when serialization is required and contention is bounded.

## Common failure patterns
Holding transactions across network calls, assuming application checks are atomic, escalating isolation globally, and retrying non-idempotent operations blindly.

## Verification
Prove invariants with concurrent tests and verify acceptable waits, abort rates, and version-store growth.

## Expected output
Documented transaction boundary, isolation rationale, conflict handling, and concurrency evidence.

## Stop conditions
Stop if the business invariant is ambiguous or a proposed isolation change affects unrelated workloads without review.