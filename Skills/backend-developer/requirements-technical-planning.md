# Requirements and Technical Planning

## Purpose
Turn ambiguous backend requirements into an executable technical plan with explicit assumptions, risks, interfaces, and verification.

## When to use
Use before non-trivial features, integrations, migrations, or work with cross-team dependencies.

## Inputs
Business goal, acceptance criteria, current system, constraints, deadlines, stakeholders, non-functional requirements.

## Context to inspect
Existing workflows, domain rules, APIs, schema, dependencies, telemetry, deployment model, security and compliance constraints.

## Core knowledge
Functional/NFR decomposition, risk analysis, dependency mapping, incremental delivery, estimation uncertainty, ADRs, and acceptance evidence.

## Procedure
1. Restate the desired outcome in observable terms.
2. Separate confirmed facts from assumptions.
3. Identify affected contracts, data, components, and teams.
4. Elicit latency, scale, availability, security, and consistency constraints.
5. Compare viable approaches and reject unnecessary complexity.
6. Split work into independently verifiable increments.
7. Identify migrations, compatibility windows, rollout, and rollback.
8. Estimate with uncertainty and explicit dependencies.
9. Define verification and production signals before implementation.

## Decision points
Prefer reversible incremental changes when uncertainty is high. Invest in design depth proportional to blast radius and irreversibility.

## Common failure patterns
Estimating before understanding dependencies, treating assumptions as requirements, ignoring NFRs, big-bang plans, and no operational acceptance criteria.

## Verification
Review plan against requirements, dependency owners, failure scenarios, security/data constraints, and measurable acceptance criteria.

## Expected output
A scoped technical plan with decisions, risks, sequencing, and verification.

## Stop conditions
Stop when critical requirements, ownership, or constraints remain contradictory and implementation would create irreversible risk.