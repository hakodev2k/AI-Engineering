# Technical Strategy

## Purpose
Create a multi-quarter technical strategy that connects business goals, system constraints, and engineering investments. This skill helps a Staff Engineer turn broad direction into coherent technical bets with explicit trade-offs and sequencing.

## When to use
Use during annual or quarterly planning, major platform shifts, architectural fragmentation, or when multiple teams need a common technical direction. Do not use for routine implementation planning.

## Inputs
Business goals, product roadmap, system architecture, reliability and cost data, known risks, team constraints, technical debt inventory.

## Preconditions
Key stakeholders and decision boundaries are identifiable. Current-state evidence is available or can be gathered.

## Context to inspect
Architecture diagrams, incident history, platform dependencies, cost trends, delivery bottlenecks, developer experience issues, roadmap dependencies, and prior ADRs.

## Core knowledge
A technical strategy is a portfolio of choices, not a list of projects. It should define target outcomes, constraints, non-goals, sequencing, and evidence for revisiting decisions.

## Procedure
1. Clarify business and engineering outcomes.
2. Map the current architecture and organizational constraints.
3. Identify the few systemic problems with the highest leverage.
4. Generate alternative strategic approaches.
5. Compare alternatives by value, risk, cost, reversibility, and dependency impact.
6. Define principles and target-state boundaries.
7. Sequence investments into near-, mid-, and long-term horizons.
8. Define measurable indicators and review checkpoints.
9. Socialize the strategy and incorporate evidence-based objections.
10. Record decisions and unresolved risks.

## Decision points
Prefer reversible experiments when uncertainty is high. Prefer standardization when fragmentation creates persistent operating cost. Avoid platform work without clear consumers and outcomes.

## Common failure patterns
Technology-first roadmaps, vague aspirations, no measurable outcomes, ignoring migration cost, hidden organizational dependencies, and overcommitting to irreversible choices.

## Verification
Confirm major stakeholders understand the choices, metrics are measurable, dependencies are explicit, and roadmap items trace to strategic outcomes.

## Expected output
A concise technical strategy with goals, principles, major bets, sequencing, metrics, risks, and review points.

## Stop conditions
Stop and escalate when strategic objectives conflict materially, critical evidence is unavailable, or the proposed direction requires authority beyond the Staff Engineer's mandate.