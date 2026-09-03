# Memory Write Idempotency

## Purpose
Prevent retries, duplicate events, and concurrent workers from creating inconsistent or repeated memories.

## When to use
Use in extraction pipelines, event consumers, tool callbacks, sync jobs, or any memory write path that can execute more than once.

## Inputs
Event identifiers, memory schema, write API, retry policy, concurrency model, deduplication keys.

## Preconditions
Identify which operations are create, update, supersede, or append-only.

## Context to inspect
Message queues, job schedulers, transaction boundaries, unique constraints, request IDs, event IDs, and failure logs.

## Core knowledge
At-least-once delivery is common. Idempotency must be designed into the storage contract, not simulated with fragile pre-write existence checks.

## Procedure
1. Identify duplicate-delivery scenarios.
2. Define stable idempotency keys.
3. Add database uniqueness or compare-and-set controls.
4. Make updates conditional on expected versions where needed.
5. Ensure retries return the original logical result.
6. Separate deduplication from semantic consolidation.
7. Make downstream indexing repeat-safe.
8. Test concurrent writes.
9. Test crash recovery between storage and indexing.
10. Monitor duplicate rejection and conflict rates.

## Decision points
Use unique constraints for deterministic events. Use optimistic concurrency for mutable memories. Avoid distributed locks unless simpler atomic primitives are insufficient.

## Common failure patterns
Check-then-insert races; random idempotency keys on retry; deduplicating unrelated similar memories; storage succeeds but index retries duplicate work.

## Verification
Replay identical events and concurrent requests and prove the resulting logical memory state is unchanged.

## Expected output
An idempotent write contract with concurrency tests.

## Stop conditions
Stop when no stable operation identity can be derived for retryable writes.