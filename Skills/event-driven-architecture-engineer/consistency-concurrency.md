# Consistency and Concurrency

## Purpose
Preserve business invariants across asynchronous, independently committed services.

## When to use
Use when workflows face concurrent updates, stale events, eventual consistency, or cross-service invariants.

## Inputs
Business invariants, ownership boundaries, concurrency patterns, consistency latency, identifiers and versions.

## Context to inspect
Transaction boundaries, authoritative stores, event order, optimistic locking, compensations, and user-facing consistency expectations.

## Core knowledge
Strong consistency should live inside the smallest authoritative boundary that owns an invariant. Cross-boundary coordination generally requires eventual consistency, reservations, sagas, or redesigned ownership. Versioning detects stale writes; idempotency handles repeats.

## Procedure
1. Write each invariant explicitly.
2. Assign one authoritative owner where possible.
3. Keep invariant-enforcing data in one transaction boundary when feasible.
4. Identify concurrent commands and stale-event races.
5. Add optimistic versions or conditional writes.
6. Define acceptable intermediate states.
7. Use reservation/compensation for scarce cross-service resources.
8. Define conflict resolution rather than last-write-wins by accident.
9. Test concurrent, delayed, and duplicated operations.

## Decision points
Prefer ownership redesign over distributed locking. Use optimistic concurrency for low-conflict domains; serialize per key when conflicts are frequent and order is essential.

## Common failure patterns
Cross-service invariants with no coordinator, timestamp-based conflict resolution, stale projections used for authoritative decisions, and silent lost updates.

## Verification
Concurrency tests preserve documented invariants and expose conflicts deterministically; eventual states converge inside agreed bounds.

## Expected output
An explicit consistency model with ownership, conflict, version, and compensation rules.

## Stop conditions
Stop when business stakeholders cannot define acceptable intermediate or conflict states.