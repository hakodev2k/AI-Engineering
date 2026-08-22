# State Management

## Purpose
Choose and implement Angular state ownership that remains understandable as features grow.

## When to use
Use when state spans components, survives navigation, coordinates workflows, or has become difficult to reason about.

## Inputs
State inventory, user journeys, persistence needs, event flows, and current implementation.

## Context to inspect
Inspect component state, services, signals, RxJS stores, external state libraries, router state, cache state, and server-owned data.

## Core knowledge
Not all data is application state. Separate server state, URL state, ephemeral UI state, and durable client state. Minimize writable sources and make transitions explicit.

## Procedure
1. Inventory state and classify its lifetime and owner.
2. Keep ephemeral state local.
3. Put shareable feature state behind a feature boundary.
4. Derive rather than duplicate values.
5. Model mutations as meaningful actions.
6. Define persistence and reset semantics.
7. Handle concurrent requests and stale data explicitly.
8. Add tests for transitions and selectors/computed state.

## Decision points
Use simple services/signals until coordination complexity justifies a store library. Prefer URL state for shareable navigation state and server caching tools for server-owned data.

## Common failure patterns
Globalizing everything, duplicate sources of truth, storing derived values, leaking mutable state, stale caches, and state libraries used as ceremony.

## Verification
Trace ownership for every important value, test refresh/navigation behavior, and verify concurrent actions do not corrupt state.

## Expected output
A minimal state model with explicit ownership and transitions.

## Stop conditions
Stop when persistence, consistency, or navigation requirements are unresolved.