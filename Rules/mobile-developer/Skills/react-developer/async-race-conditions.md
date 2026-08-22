# Async Race Conditions

## Purpose
Prevent stale responses, duplicate actions, and ordering bugs in interactive React applications.

## When to use
Use for autocomplete, rapid navigation, mutations, background refresh, uploads, and dependent requests.

## Inputs
Async flows, cancellation support, mutation semantics, state transitions.

## Preconditions
Identify which result should win when operations overlap.

## Context to inspect
Fetch cancellation, request identifiers, query library behavior, debounce/throttle, optimistic state.

## Core knowledge
Async completion order is not guaranteed. Correctness requires explicit ownership, cancellation, sequencing, or idempotency rather than assumptions about timing.

## Procedure
1. Enumerate overlapping operations.
2. Define winner/ordering semantics.
3. Cancel obsolete reads where possible.
4. Ignore stale completions using request identity when cancellation is insufficient.
5. Debounce only to reduce frequency, not to guarantee ordering.
6. Guard duplicate writes and surface in-progress state.
7. Reconcile optimistic updates with server outcomes.
8. Test reordered and delayed responses.

## Decision points
Prefer cancellation for obsolete work; use sequencing/idempotency when operations must still complete safely.

## Common failure patterns
Last completion accidentally wins, double-submit, stale autocomplete results, optimistic rollback corrupting newer state.

## Verification
Artificially delay/reorder responses and rapidly repeat interactions.

## Expected output
Deterministic behavior under overlapping async work.

## Stop conditions
Stop if server mutation semantics cannot support required ordering or idempotency.