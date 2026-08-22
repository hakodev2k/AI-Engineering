# Transaction Boundaries

## Purpose
Define correct transactional scopes that protect business invariants without creating unnecessary contention or distributed coordination.

## When to use
Use when workflows update multiple records, modules, or services; when consistency bugs occur; or when transaction scope is unclear.

## Inputs
Business invariants, workflow steps, data ownership, database capabilities, concurrency model, integration requirements.

## Context to inspect
Existing transactions, isolation levels, locks, retries, outbox/inbox patterns, distributed calls, and failure handling.

## Core knowledge
A transaction should normally align with the smallest consistency boundary that must commit atomically. Cross-service atomicity is expensive; sagas, outbox patterns, and compensating actions are often safer.

## Procedure
1. Identify the invariant that requires atomicity.
2. Map all state changes in the workflow.
3. Minimize the local transaction boundary.
4. Choose an isolation level based on actual anomalies to prevent.
5. Avoid remote calls inside database transactions.
6. Use outbox/inbox or equivalent patterns for reliable cross-boundary messaging.
7. Define compensation and reconciliation for multi-step workflows.
8. Test concurrent updates and partial failures.

## Decision points
Use local ACID transactions for single-owner invariants. Use sagas or eventual consistency when state spans independent services. Use pessimistic locking only when contention and correctness justify it.

## Common failure patterns
Long transactions, distributed transactions by default, remote calls while holding locks, missing idempotency, retrying non-idempotent operations, and assuming default isolation prevents every race.

## Verification
Run concurrency tests, failure injection, duplicate-message tests, and invariant checks.

## Expected output
Explicit transaction and consistency boundaries with recovery semantics.

## Stop conditions
Stop when business invariants or ownership boundaries are unknown, or a destructive consistency change needs approval.