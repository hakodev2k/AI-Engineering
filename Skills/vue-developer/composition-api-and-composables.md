# Composition API and Composables

## Purpose
Build reusable Vue behavior with the Composition API while preserving lifecycle correctness, ownership, and testability.

## When to use
Use for feature logic, reusable reactive behavior, lifecycle integrations, or refactoring complex components.

## Inputs
Existing components, reactive state, lifecycle needs, dependencies, and reuse requirements.

## Context to inspect
Check Vue version, existing conventions, SSR usage, stores, utilities, and whether similar composables already exist.

## Core knowledge
Composables encapsulate reactive behavior, not arbitrary code. Reactive dependencies, cleanup, lifecycle scope, and returned API stability matter. Avoid hiding broad mutable global state inside composables.

## Procedure
1. Identify cohesive behavior and its owner.
2. Separate pure utilities from reactive behavior.
3. Define explicit inputs and returned state/actions.
4. Choose ref, reactive, computed, or readonly intentionally.
5. Register lifecycle effects in the correct scope.
6. Clean up listeners, timers, subscriptions, and requests.
7. Keep side effects explicit.
8. Test state transitions and cleanup.
9. Document constraints when behavior depends on component context.

## Decision points
Use a composable for reusable or isolatable reactive behavior; a plain function for pure logic; a store for shared application state. Return readonly state when callers should mutate only through actions.

## Common failure patterns
Composable dumping grounds, hidden singletons, missing cleanup, destructuring reactive objects incorrectly, excessive watchers, and APIs exposing implementation details.

## Verification
Mount representative consumers, verify lifecycle cleanup, test reactive transitions, and confirm multiple instances do not leak state unless sharing is intentional.

## Expected output
Focused composables with explicit contracts and predictable lifecycle behavior.

## Stop conditions
Stop when ownership is unclear, SSR constraints are unknown, or refactoring would silently alter shared-state semantics.