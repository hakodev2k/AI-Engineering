# Entity and Component Design

## Purpose
Model game objects through cohesive composition so behavior remains reusable, inspectable, and performant as content grows.

## When to use
Use when designing actors, enemies, interactables, abilities, equipment, status effects, or reusable world behaviors.

## Inputs
Gameplay concepts, engine object/component model, lifecycle rules, performance profile, serialization needs, and networking requirements.

## Context to inspect
Inspect existing components, inheritance trees, entity lifecycle, update registration, serialization, pooling, event flow, and ownership.

## Core knowledge
Components should represent meaningful capabilities or data ownership rather than arbitrary code fragments. Composition reduces inheritance rigidity but excessive micro-components can increase coordination cost. ECS/data-oriented approaches optimize different workloads than object-oriented components.

## Procedure
1. Identify stable capabilities and data groups.
2. Separate identity from replaceable behavior.
3. Define ownership and lifecycle of each component.
4. Minimize cross-component hidden dependencies.
5. Decide how components communicate.
6. Keep high-frequency data layouts profiler-informed.
7. Define serialization and versioning behavior.
8. Validate pooling/reset semantics.
9. Add tests around reusable rules.

## Decision points
Use classic components for heterogeneous authored objects and straightforward workflows; ECS/data-oriented processing when large homogeneous populations and cache efficiency justify complexity.

## Common failure patterns
Component explosion, GetComponent-style lookups in hot loops, hidden required siblings, shared mutable state, duplicated lifecycle logic, and inheritance disguised inside component dependencies.

## Verification
Create representative entity compositions, remove/replace optional components, profile high-count scenarios, and verify serialization and reset behavior.

## Expected output
Composable entity models with explicit dependencies, stable lifecycle behavior, and measured scalability.

## Stop conditions
Stop when entity ownership, persistence, or networking authority is unresolved or when architecture changes require incompatible content migration.