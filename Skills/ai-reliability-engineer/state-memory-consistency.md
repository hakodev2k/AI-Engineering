# State and Memory Consistency

## Purpose
Keep conversational, agent, and long-lived AI state coherent across retries, concurrency, failover, and partial updates.

## When to use
Use for chat sessions, agent memory, workflow checkpoints, personalization state, or any AI behavior that depends on persisted context.

## Inputs
State schema, storage model, concurrency patterns, retention rules, retry behavior, session lifecycle, replication topology.

## Preconditions
Authoritative state sources and ownership boundaries are identified.

## Context to inspect
Session stores, databases, caches, vector memory, checkpoints, event logs, optimistic locking, replication, cleanup jobs.

## Core knowledge
Reliability failures can arise from stale or duplicated state even when inference is healthy. State transitions must handle concurrent writes, retries, ordering, retention, and partial persistence explicitly.

## Procedure
1. Identify authoritative and derived state.
2. Define consistency requirements per state element.
3. Add versioning or concurrency control to mutable state.
4. Make retried writes idempotent.
5. Establish ordering rules for events and messages.
6. Bound cache staleness and define invalidation.
7. Persist checkpoints atomically at safe workflow boundaries.
8. Handle partial persistence and recovery.
9. Test concurrent sessions, retries, failover, and delayed events.
10. Monitor conflict, duplicate, and stale-read rates.

## Decision points
Use strong consistency where stale state could cause unauthorized or irreversible actions; accept eventual consistency for low-risk derived memory when latency matters more.

## Common failure patterns
Last-write-wins without intent, duplicate memory entries, cache preceding durable write, lost checkpoint updates, and reusing expired session context.

## Verification
Concurrency and failover tests show state invariants remain true and retries do not create duplicate or contradictory state.

## Expected output
A state reliability model with invariants, consistency choices, versioning, recovery behavior, and tests.

## Stop conditions
Escalate when state semantics or privacy retention requirements are ambiguous.