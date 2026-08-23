# Frontend Architecture

## Purpose
Design maintainable browser application boundaries, modules, state ownership, and dependency flow.

## When to use
New applications, major features, frontend rewrites, or codebases with coupling and ownership problems.

## Inputs
Requirements, repository, UI flows, API contracts, build configuration, performance constraints.

## Context to inspect
Existing component hierarchy, routing, state management, shared modules, dependency graph, conventions, tests.

## Core knowledge
Prefer cohesive feature boundaries, explicit data flow, stable contracts, minimal global state, and framework-native composition. Architecture should reduce change cost rather than maximize abstraction.

## Procedure
1. Map user journeys and feature boundaries.
2. Identify shared versus feature-local concerns.
3. Define routing and composition boundaries.
4. Assign state ownership near consumers.
5. Separate server state from client UI state.
6. Define API and error boundaries.
7. Establish dependency direction and reusable primitives.
8. Add testing seams and observability.
9. Validate bundle and rendering implications.
10. Document consequential decisions.

## Decision points
Use shared abstractions only for repeated stable behavior. Prefer local state until cross-feature coordination justifies broader state management.

## Common failure patterns
Global-state overuse, giant shared folders, circular dependencies, business logic inside presentation components, premature design systems, and hidden API coupling.

## Verification
Build and tests pass; feature boundaries can change independently; dependency graph has no unintended cycles; representative flows work and performance budgets remain acceptable.

## Expected output
A clear frontend structure with justified boundaries and migration steps.

## Stop conditions
Escalate when product flows, platform constraints, or ownership boundaries are materially unknown.