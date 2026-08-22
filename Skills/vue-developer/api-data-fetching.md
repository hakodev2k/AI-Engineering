# API Data Fetching

## Purpose
Implement resilient Vue data fetching with clear ownership of loading, errors, cancellation, freshness, and concurrency.

## When to use
Use when integrating REST/GraphQL services, refactoring ad-hoc requests, or fixing stale/racing UI data.

## Inputs
API contract, authentication model, freshness requirements, UX states, and error semantics.

## Context to inspect
Inspect HTTP client wrappers, interceptors, stores/composables, caching libraries, SSR behavior, and backend contracts.

## Core knowledge
Remote state differs from client state. Requests need cancellation or stale-response protection, explicit error mapping, and defined freshness. Retries must be bounded and safe.

## Procedure
1. Define data owner and fetch trigger.
2. Model idle/loading/success/empty/error states.
3. Validate request and response contracts.
4. Propagate cancellation where navigation or input can supersede requests.
5. Prevent stale responses from winning races.
6. Centralize transport concerns without hiding domain errors.
7. Add caching only with explicit freshness/invalidation rules.
8. Bound retries and honor idempotency.
9. Test latency, failures, cancellation, and rapid input changes.

## Decision points
Use a server-state library when caching/refetch/invalidation complexity is substantial; a focused composable for simpler flows; stores only when shared coordination is required.

## Common failure patterns
Boolean-only loading state, swallowed errors, unbounded retries, stale race results, duplicated fetches, and caching without invalidation.

## Verification
Verify network behavior, error UX, cancellation, race handling, cache freshness, and authentication expiry paths.

## Expected output
Predictable remote-data behavior under success, latency, concurrency, and failure.

## Stop conditions
Stop if API semantics, authorization, or data freshness requirements are materially ambiguous.