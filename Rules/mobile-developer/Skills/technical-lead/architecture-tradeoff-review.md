# Architecture Trade-off Review

## Purpose
Evaluate architecture choices against real requirements rather than fashion or personal preference.

## When to use
Use for meaningful changes to boundaries, data ownership, deployment, integration, concurrency, or platform choices.

## Inputs
Candidate designs, NFRs, constraints, costs, team capability, current architecture.

## Context to inspect
Inspect change frequency, scaling profile, failure modes, operational maturity, data consistency needs, and migration constraints.

## Core knowledge
Architecture is a set of trade-offs. Complexity must earn its cost through measurable benefit. Reversibility, blast radius, coupling, operability, and evolutionary cost matter as much as initial implementation.

## Procedure
1. Define the decision and required qualities.
2. Establish evaluation criteria and weights.
3. Include the simplest viable baseline.
4. Compare alternatives across delivery, runtime, operations, security, cost, and evolution.
5. Identify assumptions and failure scenarios.
6. Estimate migration and rollback cost.
7. Prototype uncertain high-risk claims when useful.
8. Select an option and document rejected alternatives.
9. Define review triggers.

## Decision points
Prefer simpler architecture when benefits are speculative. Accept complexity when evidence shows it materially improves required qualities.

## Common failure patterns
Pattern-driven design, ignoring operational cost, optimizing only happy paths, and presenting a preferred solution without alternatives.

## Verification
The chosen option satisfies explicit criteria, major assumptions are tested or visible, and rollback/evolution paths are understood.

## Expected output
A defensible architecture decision with trade-offs, evidence, risks, and revisit conditions.

## Stop conditions
Escalate when regulatory, security, budget, or organization-wide platform decisions exceed team authority.