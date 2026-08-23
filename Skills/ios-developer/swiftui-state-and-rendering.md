# SwiftUI State and Rendering

## Purpose
Design predictable SwiftUI state ownership, observation, view identity, and rendering behavior without unnecessary invalidation or lifecycle bugs.

## When to use
Use for SwiftUI features, state bugs, excessive re-rendering, navigation state, or UIKit-to-SwiftUI migration.

## Inputs
Feature states, ownership rules, data sources, navigation requirements, performance symptoms.

## Context to inspect
Property wrappers/observation model, environment dependencies, view identity, task modifiers, bindings, lists, navigation, previews/tests.

## Core knowledge
SwiftUI views are transient descriptions. Correctness depends on stable identity and placing durable state with the proper owner. Derived state should generally be computed rather than duplicated.

## Procedure
1. Enumerate source-of-truth state.
2. Assign each state value one owner.
3. Separate durable model state from ephemeral UI state.
4. Pass read/write access narrowly.
5. Make list/navigation identity stable.
6. Keep side effects in explicit lifecycle/task boundaries.
7. Remove duplicated derived state.
8. Profile body updates for expensive screens.
9. Test state restoration and navigation transitions.

## Decision points
Use local state for view-owned ephemeral values; observable models for shared feature state; environment for genuinely ambient dependencies, not arbitrary globals.

## Common failure patterns
Recreating models during rendering, unstable IDs, duplicated state, broad environment mutation, side effects in body, and feedback loops through bindings.

## Verification
Exercise navigation, refresh, background/foreground transitions, dynamic data changes, and inspect rendering with Instruments when needed.

## Expected output
Clear state ownership and stable rendering behavior with tests for critical transitions.

## Stop conditions
Stop when OS/framework behavior differs by deployment version and cannot be reproduced on required devices.