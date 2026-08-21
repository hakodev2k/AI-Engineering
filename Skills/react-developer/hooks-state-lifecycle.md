# Hooks, State, and Lifecycle

## Purpose
Use React hooks correctly while avoiding stale state, effect loops, race conditions, and unnecessary synchronization.

## When to use
Use when implementing stateful behavior, custom hooks, effects, subscriptions, or debugging lifecycle defects.

## Inputs
Component behavior, data dependencies, events, async operations, subscriptions.

## Preconditions
Know the React version and whether concurrent rendering/server components apply.

## Context to inspect
`useState`, reducers, effects, refs, memoization, custom hooks, dependency arrays, cleanup paths.

## Core knowledge
State should represent minimal source-of-truth data. Derived values usually belong in render. Effects synchronize React with external systems; they are not a generic reaction mechanism.

## Procedure
1. Identify source-of-truth state.
2. Derive computable values instead of duplicating state.
3. Model event-driven updates explicitly.
4. Use effects only for external synchronization.
5. Add cleanup for subscriptions/resources.
6. Handle cancellation or stale async responses.
7. Extract reusable behavior into custom hooks with explicit contracts.
8. Remove memoization that has no measured benefit.

## Decision points
Use reducers for complex transitions, refs for mutable values that do not drive rendering, and effects only when an external system must be synchronized.

## Common failure patterns
Effect chains, missing dependencies, storing derived data, stale closures, state updates after obsolete requests, unnecessary `useMemo`/`useCallback`.

## Verification
Use Strict Mode during development, test rapid prop/state changes, inspect rerenders, and confirm cleanup executes.

## Expected output
Deterministic state transitions and minimal, safe effects.

## Stop conditions
Stop if external system semantics or concurrency guarantees are unknown.