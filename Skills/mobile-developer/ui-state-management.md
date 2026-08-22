# UI State Management

## Purpose
Create predictable, testable screen state and event handling across lifecycle changes and asynchronous work.

## When to use
Complex screens, shared state, async workflows, or state-related defects.

## Inputs
User flows, UI code, state model, lifecycle behavior.

## Context to inspect
State owners, subscriptions, navigation lifecycle, background tasks, persistence, recomposition/render triggers.

## Core knowledge
Distinguish durable state, transient UI state, derived state, and one-time effects. Prefer unidirectional flow when it improves reasoning.

## Procedure
1. Enumerate visible states and events.
2. Identify the authoritative owner for each state.
3. Separate state from side effects.
4. Model loading, success, empty, partial, and failure states.
5. Make transitions deterministic.
6. Cancel obsolete work.
7. Persist only state that must survive recreation/relaunch.
8. Test transitions independently of rendering.

## Decision points
Use local state for local concerns; promote state only when multiple consumers or lifecycle requirements justify it.

## Common failure patterns
Duplicated sources of truth, stale async results, event replay, excessive global state, hidden mutation.

## Verification
Exercise lifecycle recreation, rapid interaction, failure/retry, and state transition tests.

## Expected output
Explicit state model, events, effects, ownership, and tests.

## Stop conditions
Stop when required UX behavior for restoration or concurrency is undefined.