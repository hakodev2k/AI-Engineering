# Architecture Style Selection

## Purpose
Select an architecture style that fits the problem instead of defaulting to fashionable patterns.

## When to use
Use when deciding between modular monolith, layered architecture, microservices, event-driven systems, serverless, data pipelines, or hybrid approaches.

## Inputs
Requirements, NFRs, team topology, deployment needs, domain boundaries, scale, compliance, delivery model, existing landscape.

## Preconditions
Decision drivers and constraints are explicit.

## Context to inspect
Team size and autonomy, change coupling, operational maturity, deployment frequency, data consistency needs, transaction boundaries, scaling hotspots, platform capabilities.

## Core knowledge
Architecture style affects coupling, operational complexity, consistency, failure modes, delivery independence, observability, testing, and cost. Distribution is not automatically scalability or agility.

## Procedure
1. Identify the top architecture drivers.
2. Evaluate the simplest style that satisfies them.
3. Compare at least two plausible alternatives.
4. Assess coupling, deployment independence, failure isolation, consistency, operational burden, and skill requirements.
5. Check team topology and ownership fit.
6. Model likely failure modes and debugging complexity.
7. Estimate infrastructure and platform overhead.
8. Prefer evolutionary boundaries when uncertainty is high.
9. Record the decision and rejected alternatives in an ADR.
10. Define signals that would justify revisiting the choice.

## Decision points
Prefer modular monoliths when distribution has no clear business value. Use microservices when independent ownership/deployment, scaling, or isolation benefits outweigh distributed-systems costs.

## Common failure patterns
Microservices by default, over-layering, pattern stacking, ignoring team maturity, designing for hypothetical scale, confusing physical distribution with logical modularity.

## Verification
Chosen style maps directly to prioritized drivers and its known operational costs are accepted.

## Expected output
Documented architecture-style decision with trade-offs and revisit criteria.

## Stop conditions
Stop if organization capability cannot support the proposed operational model.