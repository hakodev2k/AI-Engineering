# Technical Roadmapping

## Purpose
Translate technical strategy into an executable roadmap that balances platform investment, product dependencies, reliability work, migrations, and uncertainty across teams.

## When to use
Use for multi-quarter engineering planning, cross-team initiatives, platform programs, or when technical prerequisites constrain product sequencing.

## Inputs
Technical strategy, product roadmap, dependency map, risk register, capacity assumptions, migration plans, operational commitments.

## Preconditions
Strategic outcomes and major constraints are sufficiently clear.

## Context to inspect
Team roadmaps, architecture dependencies, critical-path work, staffing constraints, seasonal load, compliance deadlines, and deprecation timelines.

## Core knowledge
A roadmap should describe outcomes and sequencing rather than false precision. Dependencies, optionality, learning milestones, and rollback paths are central to senior planning.

## Procedure
1. Derive engineering outcomes from strategy.
2. Identify mandatory prerequisites and external deadlines.
3. Group work into coherent capability increments.
4. Map dependencies and critical paths.
5. Separate committed work from exploratory bets.
6. Define milestones that produce usable evidence or value.
7. Reserve capacity for reliability and emergent risk.
8. Sequence work to reduce irreversible commitments early.
9. Review with affected teams and product partners.
10. Revisit the roadmap when assumptions materially change.

## Decision points
Favor milestones that unlock independent progress. Delay irreversible architecture when discovery can reduce uncertainty first. Avoid sequencing that requires synchronized delivery across many teams without strong necessity.

## Common failure patterns
Date-only roadmaps, hidden dependencies, zero contingency, platform work detached from consumers, and treating exploratory work as guaranteed delivery.

## Verification
Confirm each roadmap item maps to an outcome, dependencies have owners, milestones have acceptance evidence, and the critical path is understood.

## Expected output
A cross-team technical roadmap with outcomes, milestones, dependencies, risks, and review points.

## Stop conditions
Stop when product priorities are unstable enough to invalidate sequencing or staffing assumptions make the roadmap infeasible.