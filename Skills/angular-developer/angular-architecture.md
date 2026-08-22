# Angular Architecture

## Purpose
Design maintainable Angular applications with clear feature boundaries, dependency direction, and ownership.

## When to use
Use when starting an application, adding a major feature, or restructuring a codebase whose coupling slows delivery.

## Inputs
Repository, product requirements, routes, data flows, deployment constraints, and team conventions.

## Context to inspect
Inspect Angular version, bootstrap style, routes, feature folders, shared code, state ownership, API clients, and dependency graph.

## Core knowledge
Prefer cohesive feature boundaries, explicit public APIs, standalone components where appropriate, and dependency direction that prevents shared modules from becoming dumping grounds. Architecture should optimize changeability rather than maximize layers.

## Procedure
1. Identify business capabilities and major user journeys.
2. Map routes and state ownership to feature boundaries.
3. Separate presentation, orchestration, domain logic, and infrastructure only where complexity justifies it.
4. Define allowed dependencies between features and shared primitives.
5. Keep cross-cutting services narrow and explicit.
6. Design lazy-loading boundaries for meaningful bundles.
7. Establish error, configuration, authentication, and observability conventions.
8. Validate architecture against likely changes and team workflow.
9. Record consequential decisions.

## Decision points
Choose local feature structure over global technical layers when it improves cohesion. Add abstractions only when multiple consumers or volatile dependencies justify them.

## Common failure patterns
God shared modules, circular dependencies, global state for local concerns, premature generic abstractions, feature leakage, and architecture based on folder aesthetics rather than change boundaries.

## Verification
Build and tests pass; dependency rules hold; features can evolve without unrelated edits; lazy boundaries work; architecture decisions match actual requirements.

## Expected output
A feature-oriented Angular structure with explicit boundaries and documented trade-offs.

## Stop conditions
Escalate when product boundaries are unknown, required platform constraints conflict, or restructuring would require an unapproved breaking migration.