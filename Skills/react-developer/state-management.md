# State Management

## Purpose
Select and implement the right state ownership model for local, shared, server, URL, and persistent state.

## When to use
Use when state crosses component boundaries, becomes hard to reason about, or a global store is being considered.

## Inputs
State consumers, update frequency, persistence needs, server ownership, URL requirements.

## Preconditions
Classify each state item before choosing a library.

## Context to inspect
Existing stores, context providers, query caches, URL state, local storage, form state.

## Core knowledge
Different state classes have different lifecycles. Server state should usually use a data-fetching cache; URL state should remain addressable; transient UI state should stay local where possible.

## Procedure
1. Inventory state and owners.
2. Classify local, shared client, server, URL, form, and persisted state.
3. Place state at the narrowest useful scope.
4. Choose Context only for low-frequency cross-tree dependencies.
5. Choose a store when coordinated mutations/selectors justify it.
6. Normalize or derive data only when complexity warrants it.
7. Define persistence/versioning rules.
8. Add tests for critical transitions.

## Decision points
Prefer local state first; use query libraries for server state; use a global store only when shared client-state complexity is real.

## Common failure patterns
One global store for everything, duplicated server cache, excessive Context rerenders, hidden persistence, stale URL-independent filters.

## Verification
Trace ownership and updates, inspect rerenders, refresh/deep-link flows, and test concurrent consumers.

## Expected output
Explicit state ownership with minimal synchronization cost.

## Stop conditions
Stop when data ownership between frontend and backend is unresolved.