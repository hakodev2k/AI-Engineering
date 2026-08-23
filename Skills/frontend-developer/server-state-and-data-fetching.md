# Server State and Data Fetching

## Purpose
Build reliable client-server data flows with explicit caching, freshness, cancellation, retry, error, mutation, and concurrency semantics.

## When to use
Use when consuming HTTP/GraphQL APIs, implementing search/list/detail views, mutations, optimistic updates, or diagnosing stale and duplicated requests.

## Inputs
API contracts, UX requirements, authentication behavior, freshness expectations, network constraints, and existing client/cache code.

## Context to inspect
Request client, cache keys, invalidation, retry policy, loading/error UI, cancellation, pagination, mutation flows, and observability.

## Core knowledge
Remote data has independent authority and latency. Correct fetching requires stable query identity, bounded retries, cancellation for obsolete work, explicit freshness, and mutation reconciliation. HTTP semantics and API contracts matter more than framework syntax.

## Procedure
1. Define the data owner and freshness requirement.
2. Inspect endpoint semantics and error contracts.
3. Create stable query/cache keys from meaningful inputs.
4. Handle loading, empty, partial, stale, and error states separately.
5. Cancel or ignore obsolete requests.
6. Configure retries only for safe transient failures with backoff.
7. Define pagination or incremental-loading behavior.
8. Reconcile mutations through invalidation, direct cache update, or optimistic update.
9. Protect against out-of-order responses.
10. Test slow networks, failures, repeated navigation, and concurrent mutations.

## Decision points
Use optimistic updates when rollback is reliable and perceived latency matters. Prefer confirmed updates for high-risk actions. Cache based on reuse and freshness requirements rather than by default.

## Common failure patterns
Infinite retries, cache-key collisions, request waterfalls, stale mutation results, race conditions, treating every failure as generic, and hiding errors behind perpetual spinners.

## Verification
Network traces show expected request counts, stale results do not overwrite newer state, mutation outcomes reconcile correctly, and failure states recover without refresh.

## Expected output
A documented and tested remote-data flow with caching, freshness, cancellation, retry, and mutation rules.

## Stop conditions
Stop when API consistency/error semantics are unknown, required authentication behavior is unresolved, or safe mutation reconciliation cannot be defined.