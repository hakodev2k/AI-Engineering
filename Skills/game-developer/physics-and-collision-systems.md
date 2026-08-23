# Physics and Collision Systems

## Purpose
Implement stable, performant collision and physics interactions while respecting engine solver constraints and gameplay requirements.

## When to use
Use for movement, projectiles, vehicles, ragdolls, triggers, destructibles, collision bugs, tunneling, jitter, or physics performance.

## Inputs
Engine physics settings, collision layers, body types, shapes, movement requirements, frame timing, scale conventions, and profiler data.

## Context to inspect
Inspect fixed timestep, collision matrix, body configuration, constraints, continuous collision settings, queries, trigger callbacks, and transforms modified outside physics.

## Core knowledge
Physics engines are numerical approximations. Stable simulation depends on consistent units, timestep, solver settings, appropriate collider complexity, and clear ownership between kinematic/gameplay movement and dynamic simulation.

## Procedure
1. Define which interactions need physical simulation versus logical queries.
2. Validate world scale and timestep.
3. Configure collision layers deliberately.
4. Choose static, kinematic, or dynamic bodies by ownership.
5. Use simple collision shapes where possible.
6. Address fast-object tunneling selectively.
7. Avoid conflicting transform and solver control.
8. Profile contacts, queries, and active bodies.
9. Test edge cases at low frame rate and high velocity.

## Decision points
Prefer queries/triggers for gameplay detection that does not need solver response. Use continuous collision only where tunneling risk justifies cost. Use custom character movement when gameplay control exceeds rigid-body requirements.

## Common failure patterns
Moving dynamic bodies by raw transforms, oversized collision matrices, mesh colliders everywhere, physics logic in render update, unbounded raycasts, and assuming identical floating-point results across machines.

## Verification
Run stress scenes, inspect profiler physics cost, test high-speed and boundary cases, and confirm collision layers and callbacks match design.

## Expected output
Predictable collision behavior with explicit ownership and measured physics cost.

## Stop conditions
Stop when engine solver limitations conflict with required behavior or when deterministic networking requirements cannot be satisfied by the chosen physics approach.