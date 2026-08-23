# Frontend Architecture

## Purpose
Design maintainable browser applications by defining clear module boundaries, dependency direction, ownership, and evolution rules before implementation complexity spreads across the codebase.

## When to use
Use when starting a frontend, splitting a growing application, reviewing structural debt, or planning a major feature. Do not impose a new architecture when the existing structure already satisfies the requirements with lower change risk.

## Inputs
Repository, product requirements, route map, component tree, state/data flows, build configuration, deployment model, team constraints, and known non-functional requirements.

## Preconditions
Understand the product boundaries and inspect the existing code before proposing structural changes.

## Context to inspect
Entry points, routes, feature modules, shared libraries, state ownership, API clients, dependency graph, design system, tests, build pipeline, and runtime configuration.

## Core knowledge
Architecture should optimize changeability, cohesion, testability, runtime behavior, and team ownership. Prefer feature-oriented boundaries and explicit dependencies over arbitrary technical folders. Shared code creates coupling and requires deliberate ownership.

## Procedure
1. Identify product capabilities and independently changing features.
2. Map current dependencies and shared concerns.
3. Define feature, application, domain, infrastructure, and UI boundaries only where useful.
4. Assign state and data ownership.
5. Establish dependency rules and public module APIs.
6. Separate reusable design primitives from business-specific components.
7. Define routing, error, configuration, and integration boundaries.
8. Check lazy-loading and bundle implications.
9. Plan incremental migration when restructuring existing code.
10. Document decisions that future contributors must preserve.

## Decision points
Choose modularity based on independent change and ownership, not folder aesthetics. Extract shared packages only when reuse and lifecycle justify the added versioning and dependency cost.

## Common failure patterns
Global shared folders, circular dependencies, business logic in generic components, duplicated data ownership, architecture by framework fashion, and large rewrites without migration checkpoints.

## Verification
Confirm dependency rules are enforceable, representative features fit naturally, tests can isolate boundaries, build output remains acceptable, and new work does not require bypassing the architecture.

## Expected output
An implementable frontend structure with boundaries, dependency rules, ownership, migration steps, and recorded trade-offs.

## Stop conditions
Escalate when product boundaries are unknown, restructuring requires incompatible platform changes, or migration risk exceeds the agreed scope.