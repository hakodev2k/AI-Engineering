# Server State and Data Fetching

## Purpose
Design reliable client-server data loading, caching, mutation, synchronization, and failure handling.

## When to use
Any UI consuming APIs or server-rendered data.

## Inputs
API contracts, consistency needs, user flows, latency expectations, caching requirements.

## Context to inspect
Existing HTTP client, query library, authentication, cache policies, retries, loading/error UX.

## Core knowledge
Server state has freshness, ownership, concurrency, and failure semantics different from local UI state. Cache keys, invalidation, idempotency, and cancellation are correctness concerns.

## Procedure
1. Classify reads and mutations.
2. Define cache identity and freshness.
3. Model loading, stale, empty, and error states.
4. Cancel obsolete requests where useful.
5. Deduplicate concurrent reads.
6. Define mutation success and invalidation behavior.
7. Use optimistic updates only with safe rollback semantics.
8. Bound retries and respect server signals.
9. Protect credentials and sensitive payloads.
10. Test slow, failed, duplicated, and out-of-order responses.

## Decision points
Prefer refetching when correctness matters more than latency; optimistic updates when conflicts are rare and reversible. Cache only when reuse and freshness semantics are clear.

## Common failure patterns
Unbounded retries, stale cache after mutations, duplicate requests, race conditions, storing server state in unrelated global stores, and swallowing errors.

## Verification
Exercise normal, slow, offline, error, concurrent, and retry paths; confirm cache behavior and server-side effects.

## Expected output
Predictable data-flow behavior with explicit freshness and failure semantics.

## Stop conditions
Escalate when API consistency or mutation semantics are undefined.