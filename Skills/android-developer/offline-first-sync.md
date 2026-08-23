# Offline-First Synchronization

## Purpose
Design Android data flows that remain useful without connectivity and reconcile local and remote state predictably when connectivity returns.

## When to use
Use for field, travel, collaboration, catalog, messaging, or any feature where intermittent connectivity is expected.

## Inputs
Data ownership, conflict rules, freshness needs, server capabilities, local schema, mutation semantics, connectivity constraints.

## Preconditions
Identify the source of truth presented to UI and which operations must be durable offline.

## Context to inspect
Repositories, Room schema, API contracts, mutation queues, timestamps/version fields, WorkManager jobs, cache invalidation, error telemetry.

## Core knowledge
Offline-first systems need explicit synchronization state, durable pending mutations, deterministic conflict handling, and idempotent replay. Connectivity signals alone do not prove the network is usable.

## Procedure
1. Define local read behavior and freshness indicators.
2. Classify mutations by offline eligibility.
3. Persist pending operations before reporting durable acceptance.
4. Assign stable operation IDs for replay/deduplication.
5. Define pull, push, and reconciliation ordering.
6. Choose conflict policy per entity/field rather than globally.
7. Make sync resumable after process death.
8. Bound retry and surface terminal failures.
9. Test long offline periods, clock skew, duplicate replay, conflicts, and partial sync.
10. Instrument queue age, conflict rate, sync latency, and failures.

## Decision points
Use last-write-wins only when lost concurrent edits are acceptable. Prefer server versions, merge semantics, or domain-specific conflict resolution when integrity matters.

## Common failure patterns
In-memory queues, relying on connectivity broadcasts, silent conflict overwrite, non-idempotent replay, UI reading directly from both network and database, and no terminal-error state.

## Verification
Disable connectivity, perform supported workflows, kill/restart the app, reconnect, and verify final local/remote invariants and no duplicated writes.

## Expected output
Source-of-truth policy, durable sync protocol, conflict rules, replay guarantees, and resilience-test evidence.

## Stop conditions
Escalate when backend contracts cannot support safe reconciliation or business conflict rules are undefined.