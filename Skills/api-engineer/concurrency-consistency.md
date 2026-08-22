# API Concurrency and Consistency

## Purpose
Prevent lost updates and misleading state transitions when multiple clients modify shared resources.

## When to use
Use for mutable resources, inventory, balances, workflow state, and collaborative updates.

## Inputs
Consistency requirements, data-store capabilities, update frequency, and conflict semantics.

## Context to inspect
Transaction boundaries, version columns, ETags, locking, retries, and downstream side effects.

## Core knowledge
Optimistic concurrency detects conflicting writes and scales well when contention is moderate. Pessimistic locking can serialize critical operations but increases blocking and failure complexity.

## Procedure
1. Identify invariants and conflicting operations.
2. Define acceptable consistency level.
3. Select a concurrency token or locking strategy.
4. Expose preconditions through ETag/If-Match when appropriate.
5. Make conflict responses explicit.
6. Keep transaction scope minimal.
7. Coordinate external side effects safely.
8. Test simultaneous updates and retries.

## Decision points
Prefer optimistic concurrency for most APIs; use stronger serialization only when invariants cannot tolerate conflicts and cost is justified.

## Common failure patterns
Last-write-wins by accident, long locks, retrying conflicts blindly, and assuming database transactions cover remote services.

## Verification
Concurrent tests demonstrate preserved invariants and deterministic conflict behavior.

## Expected output
A documented consistency and conflict-handling strategy.

## Stop conditions
Escalate if business invariants require guarantees unsupported by the current architecture.