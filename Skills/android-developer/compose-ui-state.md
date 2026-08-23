# Compose UI State

## Purpose
Design Jetpack Compose screens with predictable state ownership, unidirectional data flow, stable recomposition behavior, and lifecycle-safe collection.

## When to use
Use when building or reviewing Compose UI, migrating from Views, or debugging stale/excessive recomposition. Do not hoist state without a real ownership need.

## Inputs
Screen behavior, state model, events, ViewModel/API contracts, lifecycle requirements, performance traces.

## Preconditions
Know which state is ephemeral UI state, screen state, or durable domain state.

## Context to inspect
Composable parameters, remember/rememberSaveable, state holders, ViewModels, Flow collection, keys, derivedStateOf, side effects, navigation, lists.

## Core knowledge
Compose is declarative: UI should be a function of state. Stable inputs, clear event flow, correct effect APIs, and lifecycle-aware collection prevent subtle bugs and unnecessary work.

## Procedure
1. Enumerate visible state and user/system events.
2. Assign each state item one authoritative owner.
3. Expose immutable screen state and explicit events.
4. Collect flows lifecycle-aware.
5. Use remember for composition lifetime and rememberSaveable only for restorable UI state.
6. Use LaunchedEffect, DisposableEffect, or SideEffect only for their intended lifecycle semantics.
7. Provide stable list keys and avoid expensive work in composition.
8. Derive values instead of duplicating state.
9. Test loading, error, empty, process recreation, and rapid interaction.
10. Inspect recomposition/performance when behavior is hot-path sensitive.

## Decision points
Hoist state to the lowest common owner that needs control. Keep transient visual state local unless external coordination or restoration requires promotion.

## Common failure patterns
Mutable state duplicated across layers, collecting flows without lifecycle awareness, effect keys that restart unexpectedly, unstable lambdas/models, business logic inside composables, and missing list keys.

## Verification
Verify state transitions with tests, rotation/background behavior on device, process recreation where relevant, and recomposition traces for performance-sensitive screens.

## Expected output
A deterministic state/event contract, composables with clear ownership, and evidence that lifecycle and recomposition behavior are correct.

## Stop conditions
Stop when required restoration semantics, event ownership, or lifecycle behavior is ambiguous enough to risk data loss or duplicate actions.