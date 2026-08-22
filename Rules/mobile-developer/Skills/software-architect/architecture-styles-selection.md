# Architecture Style Selection

## Purpose
Select an architecture style that fits system constraints instead of applying patterns by habit.

## When to use
Use for new systems, major redesigns, service decomposition, or when an existing style is causing delivery or operational problems.

## Inputs
Business capabilities, NFRs, team topology, deployment constraints, data ownership, integration needs, operational maturity.

## Context to inspect
Current runtime topology, release cadence, coupling, failure modes, data flows, compliance needs, observability, and infrastructure capability.

## Core knowledge
Monolith, modular monolith, layered, hexagonal, event-driven, microservices, serverless, and distributed architectures trade simplicity for different forms of isolation, scalability, autonomy, and operational cost.

## Procedure
1. Establish system goals and constraints.
2. Identify required deployment and scaling boundaries.
3. Determine consistency and communication needs.
4. Evaluate viable architecture styles against NFRs.
5. Compare complexity, cost, failure modes, and team fit.
6. Select the simplest style that satisfies priority requirements.
7. Record rejected alternatives and rationale.
8. Define evolution triggers for future change.

## Decision points
Prefer a modular monolith when independent deployment is not required. Prefer distributed services only when autonomy, scaling, isolation, or organizational boundaries justify the cost.

## Common failure patterns
Microservices by default, pattern-driven design, ignoring team capability, assuming distribution solves poor modularity, or selecting a style without measurable drivers.

## Verification
Walk through deployment, failure, scaling, data consistency, and change scenarios against the selected style.

## Expected output
A justified architecture style with trade-offs, constraints, and evolution criteria.

## Stop conditions
Stop when critical NFRs or deployment constraints are unknown or mutually incompatible.