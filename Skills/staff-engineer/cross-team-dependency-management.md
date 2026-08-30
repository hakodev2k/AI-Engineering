# Cross-Team Dependency Management

## Purpose
Reduce delivery and operational risk caused by technical dependencies that cross team boundaries, especially when sequencing, ownership, or interface expectations are unclear.

## When to use
Use for migrations, shared-platform adoption, multi-team launches, deprecations, or initiatives with critical external engineering dependencies.

## Inputs
Roadmaps, dependency graph, owners, interface contracts, milestones, critical dates, risk register, rollout plans.

## Preconditions
Major dependencies can be tied to accountable teams or external parties.

## Context to inspect
Team commitments, contract stability, lead times, release cadences, service ownership, deprecation windows, capacity constraints, and prior dependency failures.

## Core knowledge
Dependencies create coordination cost and schedule variance. Strong Staff Engineers reduce dependency count where possible, convert implicit dependencies into explicit contracts, and create early integration evidence rather than relying on status reporting.

## Procedure
1. Build the dependency graph for the desired outcome.
2. Identify critical-path and high-uncertainty dependencies.
3. Confirm owners, required inputs, and acceptance criteria.
4. Remove unnecessary dependencies through boundary redesign where feasible.
5. Establish stable contracts for remaining dependencies.
6. Sequence early integration or compatibility tests.
7. Define fallback plans and date thresholds.
8. Track evidence of readiness rather than percent-complete estimates.
9. Escalate unresolved critical-path risks early.
10. Retire temporary coordination mechanisms after completion.

## Decision points
Decouple technically when recurring coordination cost exceeds implementation cost. Accept coordination when coupling reflects a genuine domain or transactional requirement.

## Common failure patterns
Dependencies hidden in chat, synchronized launches without fallback, unclear ownership, late integration, optimistic status without evidence, and central coordination that never disappears.

## Verification
Confirm contracts are testable, critical dependencies have owners and milestones, integration evidence exists, and fallback paths are viable.

## Expected output
A dependency plan with critical path, owners, contracts, integration checkpoints, risks, and fallback actions.

## Stop conditions
Stop and escalate when a critical dependency lacks ownership, commitment, or a technically viable fallback.