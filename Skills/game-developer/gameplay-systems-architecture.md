# Gameplay Systems Architecture

## Purpose
Design maintainable gameplay systems with explicit boundaries, ownership, dependencies, and extension points so features can evolve without turning the game loop into tightly coupled logic.

## When to use
Use when creating or restructuring player mechanics, combat, progression, interaction, inventory, quests, abilities, or other cross-cutting gameplay features. Do not introduce abstractions merely for hypothetical future features.

## Inputs
Game requirements, existing code, engine/framework constraints, target platforms, performance budgets, networking model, save format, and test strategy.

## Context to inspect
Inspect the main loop, scene/entity lifecycle, component model, event/message mechanisms, dependency graph, state ownership, persistence boundaries, and existing conventions.

## Core knowledge
Separate domain rules from rendering and input where practical. Prefer explicit ownership and data flow. Composition usually scales better than deep inheritance. Architectural purity must not undermine frame-time predictability or debugging clarity.

## Procedure
1. Identify gameplay capabilities and invariants.
2. Map state owners and lifecycle boundaries.
3. Separate simulation rules from presentation and device input.
4. Define stable contracts between systems.
5. Choose direct calls, events, data-oriented processing, or components according to coupling and performance needs.
6. Identify deterministic or network-sensitive paths.
7. Define failure and reset behavior.
8. Add focused automated tests for pure rules.
9. Instrument expensive or high-frequency paths.
10. Document non-obvious architectural decisions.

## Decision points
Use direct dependencies when ownership is clear and coupling is intentional; events when multiple independent consumers react; data-oriented layouts for high-volume homogeneous processing. Avoid global event buses that hide dependencies.

## Common failure patterns
God managers, mutable global state, engine APIs embedded in every domain rule, deep inheritance trees, uncontrolled event chains, circular dependencies, and per-frame allocations hidden behind abstractions.

## Verification
Run representative gameplay flows, automated rule tests, dependency review, profiler captures, save/load checks, and network simulation where applicable. Implemented means the structure exists; verified means behavior and performance remain correct under representative load.

## Expected output
A coherent gameplay architecture with explicit ownership, testable rules, documented boundaries, and measured critical paths.

## Stop conditions
Stop when core gameplay requirements, engine lifecycle constraints, or networking authority are unresolved, or when restructuring would invalidate production content without a migration plan.