# Data Fetching and Server State

## Purpose
Implement resilient client-side data access with caching, invalidation, cancellation, and consistent UX states.

## When to use
Use for REST/GraphQL calls, query libraries, mutations, optimistic updates, and cache invalidation.

## Inputs
API contract, cacheability, mutation semantics, auth model, consistency requirements.

## Preconditions
Know which system owns the data and acceptable staleness.

## Context to inspect
Fetch clients, query keys, retry rules, invalidation, pagination, loading/error handling.

## Core knowledge
Server state is remote, asynchronous, and potentially stale. Query keys must represent dependencies. Retries must respect idempotency and error classes.

## Procedure
1. Define query identity and parameters.
2. Set stale/cache lifetimes intentionally.
3. Support cancellation for obsolete requests.
4. Normalize error handling.
5. Model loading, background refresh, empty, and failure states separately.
6. Invalidate or update caches after mutations.
7. Use optimistic updates only with rollback strategy.
8. Test race conditions and slow networks.

## Decision points
Prefer invalidation when correctness matters more than micro-optimization; patch cache directly only when mutation semantics are clear.

## Common failure patterns
Unbounded retries, unstable query keys, duplicate requests, stale optimistic data, loading flicker, cache invalidation gaps.

## Verification
Test slow/failing networks, concurrent mutations, navigation cancellation, refresh behavior, and cache consistency.

## Expected output
Predictable, resilient server-state behavior.

## Stop conditions
Stop if API consistency or mutation guarantees are undefined.