# System Boundaries and Modularity

## Purpose
Design stable module boundaries that reduce coupling, clarify ownership, and allow software to evolve safely.

## When to use
Use when decomposing a codebase, defining modules/services, reviewing dependency direction, or reducing change blast radius.

## Inputs
Repository, domain concepts, dependency graph, ownership model, change history, integration points.

## Preconditions
Inspect the current structure before proposing new boundaries.

## Context to inspect
High-churn areas, cyclic dependencies, shared databases, duplicated logic, cross-module calls, package boundaries, deployment units.

## Core knowledge
Good boundaries align with business capabilities and change patterns. Cohesion should be high within a module and coupling low across modules. Shared libraries can become hidden coupling.

## Procedure
1. Map domain capabilities and existing modules.
2. Identify frequently changing concepts and dependency cycles.
3. Group responsibilities by cohesion and ownership.
4. Define explicit public contracts between modules.
5. Enforce dependency direction.
6. Isolate infrastructure and cross-cutting concerns.
7. Remove accidental shared state.
8. Validate that common changes stay local.
9. Add automated boundary checks where practical.

## Decision points
Choose in-process modules when independent deployment is unnecessary; choose services only when operational independence provides real value.

## Common failure patterns
Technical-layer-only modules, circular references, god shared libraries, shared mutable database tables, boundaries based only on team names.

## Verification
Run dependency analysis, boundary tests, and representative change scenarios to confirm limited blast radius.

## Expected output
A modular structure with explicit responsibilities, dependency rules, and integration contracts.

## Stop conditions
Stop when domain ownership is unresolved or proposed decomposition would require unsafe data changes without a migration plan.