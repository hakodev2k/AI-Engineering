# Backend Architecture Boundaries

## Purpose
Structure backend systems into cohesive modules/services with explicit dependencies and appropriate isolation.

## When to use
Use for new systems, modularization, service extraction, dependency tangles, or ownership/scaling problems.

## Inputs
Business capabilities, change patterns, team ownership, data consistency, deployment needs, traffic, failure domains.

## Context to inspect
Module graph, data ownership, APIs/events, deployment units, transaction boundaries, shared libraries, and operational coupling.

## Core knowledge
Modularity, dependency inversion, bounded contexts, modular monoliths, microservices trade-offs, data ownership, coupling/cohesion, and Conway's Law.

## Procedure
1. Map business capabilities and change ownership.
2. Identify high-coupling dependencies and shared data.
3. Define module boundaries around cohesive responsibilities.
4. Make dependency direction explicit.
5. Give each boundary clear contracts and data ownership.
6. Keep cross-boundary transactions exceptional.
7. Choose deployment separation only for justified scaling, isolation, cadence, or ownership needs.
8. Record trade-offs in an architecture decision.
9. Validate with representative change scenarios and failures.

## Decision points
Prefer a modular monolith when operational simplicity dominates; extract services when independent scaling, failure isolation, ownership, or release cadence provides concrete value.

## Common failure patterns
Distributed monoliths, shared databases without ownership, circular module dependencies, service-per-table design, and architecture chosen for fashion.

## Verification
Trace common changes through boundaries, verify ownership and dependency rules, and test failure isolation for separated services.

## Expected output
Explicit module/service boundaries with documented rationale and dependency rules.

## Stop conditions
Stop when business ownership or consistency requirements are too ambiguous to define safe boundaries.