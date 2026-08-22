# Signals and Reactivity

## Purpose
Model Angular reactive state with signals, computed values, and effects without creating synchronization bugs.

## When to use
Use for local reactive state, derived values, state refactors, and performance-sensitive rendering.

## Inputs
State model, component/service code, event flows, and Angular version.

## Context to inspect
Inspect signal ownership, writes, computed dependencies, effects, Observable interop, and template reads.

## Core knowledge
Signals track synchronous dependencies. Computed state should remain derived rather than duplicated. Effects are for side effects, not routine state propagation. Ownership and mutation boundaries matter more than API choice.

## Procedure
1. Identify source state versus derived state.
2. Assign one clear owner for each mutable value.
3. Represent derivations with computed signals.
4. Keep writes close to domain actions.
5. Use effects only for genuine external side effects.
6. Bridge Observables deliberately at async boundaries.
7. Avoid cycles and effect-driven synchronization.
8. Test transitions and derived values.

## Decision points
Use signals for synchronous application state and RxJS when event streams, cancellation, concurrency, or temporal composition are central. Combine them at explicit boundaries.

## Common failure patterns
Duplicating computed state, nested effects, accidental write cycles, uncontrolled mutable objects, and converting every Observable to a signal without considering semantics.

## Verification
Exercise state transitions, inspect rendering updates, confirm no loops or stale values, and run tests under rapid input changes.

## Expected output
A predictable reactive state graph with explicit ownership.

## Stop conditions
Stop when the required state lifecycle or async semantics are unknown.