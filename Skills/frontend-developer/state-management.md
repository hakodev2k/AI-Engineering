# State Management

## Purpose
Choose and implement state ownership that keeps frontend behavior predictable while avoiding unnecessary global coordination and synchronization defects.

## When to use
Use when features share state, workflows span routes/components, derived state becomes inconsistent, or an existing store is difficult to reason about.

## Inputs
User flows, component tree, state inventory, server APIs, routing behavior, persistence requirements, and current store implementation.

## Context to inspect
Local state, global stores, URL state, server cache, persisted browser state, duplicated derived values, subscriptions, and update paths.

## Core knowledge
Not all data is application state. Distinguish local UI state, URL/navigation state, server state, session state, and durable client state. Prefer one authoritative owner and derive values instead of synchronizing copies.

## Procedure
1. Inventory mutable values and their consumers.
2. Classify each value by lifetime and authority.
3. Keep state at the narrowest ownership scope that satisfies consumers.
4. Put navigable/shareable state in the URL when appropriate.
5. Treat server data as a cache of remote authority rather than ordinary global state.
6. Define explicit update transitions for shared client state.
7. Derive computable values instead of storing duplicates.
8. Define persistence and invalidation rules.
9. Test concurrent updates, refreshes, navigation, and failure recovery.
10. Remove obsolete synchronization code after migration.

## Decision points
Use a global store only for genuinely cross-cutting client state. Prefer query/cache libraries for server state. Persist only values whose restoration semantics are well-defined and safe.

## Common failure patterns
Putting everything globally, mirroring server responses indefinitely, duplicated derived state, stale persisted schemas, race conditions between fetches, and side effects hidden inside selectors.

## Verification
State has a single authority, navigation and refresh behavior match requirements, stale data is invalidated correctly, and tests cover competing updates and recovery paths.

## Expected output
A state model with ownership, transitions, persistence, invalidation, and test evidence.

## Stop conditions
Escalate when authoritative data ownership is unclear, persistence introduces security risk, or backend consistency semantics are unknown.