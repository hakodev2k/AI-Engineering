# State Machines and Gameplay State

## Purpose
Represent discrete gameplay modes and transitions explicitly to prevent contradictory state, transition races, and scattered conditional logic.

## When to use
Use for character locomotion, AI modes, combat phases, menus, matches, quests, bosses, interactions, or any behavior with meaningful mutually exclusive states.

## Inputs
State definitions, transition rules, events, timers, animation dependencies, network authority, and persistence needs.

## Context to inspect
Inspect booleans representing modes, transition code, callbacks, animation events, async operations, reset paths, and state serialization.

## Core knowledge
State machines clarify legal transitions and invariants. Hierarchical or parallel state machines can model complex domains but increase reasoning cost. Not every boolean requires a state machine.

## Procedure
1. Enumerate observable states and invariants.
2. Define legal transitions and triggers.
3. Identify entry, exit, and update responsibilities.
4. Centralize transition validation.
5. Decide how interruptions and priorities work.
6. Handle asynchronous completion and cancellation.
7. Define reset, save/load, and replication behavior.
8. Instrument unexpected transitions.
9. Test transition matrices and edge cases.

## Decision points
Use hierarchical states for shared behavior among related modes; orthogonal regions only when dimensions are genuinely independent. Prefer simple explicit enums when transition behavior is trivial.

## Common failure patterns
Boolean state explosions, transitions from arbitrary callbacks, recursive transitions, forgotten exit cleanup, animation becoming the authoritative gameplay state, and non-deterministic simultaneous triggers.

## Verification
Exercise every legal transition, reject illegal transitions, test interruption/reset paths, and validate replicated or persisted state where applicable.

## Expected output
An explicit state model with controlled transitions, observable failures, and tests for critical paths.

## Stop conditions
Stop when state ownership or transition priority cannot be established, or when external animation/network behavior is undocumented.