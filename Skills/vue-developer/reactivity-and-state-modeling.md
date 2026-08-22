# Reactivity and State Modeling

## Purpose
Model Vue reactive state correctly and diagnose bugs caused by identity, mutation, dependency tracking, or inappropriate state placement.

## When to use
Use when designing state, debugging stale UI, reducing watcher complexity, or reviewing reactive data flow.

## Inputs
Components, composables, stores, observed symptoms, and state-transition requirements.

## Context to inspect
Inspect refs, reactive objects, computed values, watchers, mutations, serialization boundaries, and third-party objects.

## Core knowledge
Vue tracks reactive dependencies through proxies and refs. Derived values should normally be computed rather than duplicated state. Watchers are for side effects, not routine derivation. Object identity and deep observation have performance implications.

## Procedure
1. Classify source, derived, remote, and ephemeral UI state.
2. Assign each state item one authoritative owner.
3. Use computed values for deterministic derivation.
4. Use watchers only for necessary side effects.
5. Keep mutations explicit and localized.
6. Avoid unnecessary deep reactivity for large immutable structures.
7. Reproduce reactive bugs with minimal state transitions.
8. Test update and teardown behavior.

## Decision points
Choose ref for independent values and replaceable objects; reactive for cohesive mutable structures; shallow variants when deep tracking is unnecessary; store state only when coordination warrants it.

## Common failure patterns
Duplicated derived state, deep watchers over large graphs, mutating props, destructuring that loses reactivity, circular watcher updates, and storing server cache as unmanaged global state.

## Verification
Verify all expected state transitions, no infinite update loops, stable computed behavior, and acceptable render/update cost.

## Expected output
A clear state model with predictable reactive dependencies and minimal side effects.

## Stop conditions
Stop if third-party state semantics are undocumented or required state ownership cannot be determined.