# DataLoader and Batching

## Purpose
Eliminate repeated data-source calls during graph traversal by batching and request-scoped caching without weakening authorization or correctness.

## When to use
Use when nested resolvers repeatedly load entities by key or when traces show N+1 behavior.

## Inputs
Resolver graph, query traces, data-access API, entity keys, authorization model, and request lifecycle.

## Context to inspect
Inspect loader scope, key normalization, batch limits, cache semantics, ordering guarantees, missing-key behavior, and tenant boundaries.

## Core knowledge
A DataLoader collects loads within an execution window, performs a batch lookup, then maps results back to requested keys. Batch results must preserve key association. Its cache is normally request scoped and is not a substitute for distributed caching.

## Procedure
1. Prove repeated keyed loads exist.
2. Define a stable loader key including tenant or authorization dimensions when required.
3. Implement a bounded batch query.
4. Map every requested key to a value, absence, or controlled error.
5. Register loader lifetime per GraphQL request.
6. Replace resolver-local repeated fetches with loader calls.
7. Handle duplicate keys and ordering explicitly.
8. Instrument batch size, batch count, and downstream latency.
9. Test mixed found/missing keys and permission boundaries.
10. Compare downstream call counts before and after.

## Decision points
Batch only operations with compatible authorization and consistency semantics. Split batches when backend limits, tenant isolation, or different read guarantees require it.

## Common failure patterns
Singleton loaders, cross-user cache leakage, unbounded IN clauses, assuming backend result order matches input keys, caching mutable data too long, and hiding inefficient queries inside a loader.

## Verification
A representative nested query should reduce repeated calls while returning identical authorized results. Verify batch bounds, isolation, and latency under concurrency.

## Expected output
A request-scoped batching strategy with measured reduction in downstream work.

## Stop conditions
Stop if keys cannot be safely combined because authorization or consistency differs per item.