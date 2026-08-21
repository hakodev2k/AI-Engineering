# React Architecture

## Purpose
Design maintainable React application boundaries, composition, and dependency flow for medium-to-large products.

## When to use
Use when starting a React app, restructuring a feature, or reviewing architectural drift.

## Inputs
Repository, product requirements, routing model, state boundaries, API contracts, deployment constraints.

## Preconditions
Confirm framework/version, rendering model, routing, build tooling, and ownership boundaries.

## Context to inspect
Folder structure, feature coupling, shared libraries, state ownership, route boundaries, test strategy.

## Core knowledge
Prefer feature-oriented boundaries, explicit ownership, stable public interfaces, and dependency direction from generic to specific. Avoid global abstractions without multiple proven consumers.

## Procedure
1. Map product domains and user flows.
2. Identify route and feature boundaries.
3. Separate reusable UI, feature logic, data access, and app infrastructure.
4. Define allowed dependencies between layers/features.
5. Decide where state should live.
6. Isolate framework or vendor-specific adapters.
7. Add architecture tests or lint rules where useful.
8. Document important exceptions.

## Decision points
Choose feature folders over technical folders when product domains are stable. Prefer local state over global state unless multiple distant consumers require coordination.

## Common failure patterns
God components, circular dependencies, shared folders becoming dumping grounds, premature abstractions, hidden cross-feature state.

## Verification
Trace representative user flows, review imports across boundaries, run tests/build, and confirm new features can be added without unrelated edits.

## Expected output
Clear module boundaries, dependency rules, and a maintainable React structure.

## Stop conditions
Stop if product boundaries or rendering strategy are unresolved and materially affect the architecture.