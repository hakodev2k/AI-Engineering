# Technical Direction

## Purpose
Turn product goals and engineering constraints into coherent technical direction that teams can execute without unnecessary prescription.

## When to use
Use when starting initiatives, resolving architectural drift, or aligning multiple contributors.

## Inputs
Business goals, roadmap, architecture, constraints, risks, team capabilities, operational evidence.

## Context to inspect
Review current system boundaries, dependencies, delivery bottlenecks, incidents, technical debt, and existing decisions.

## Core knowledge
Technical direction should define outcomes, principles, constraints, and decision boundaries. Senior leadership balances delivery speed, maintainability, reliability, security, and reversibility.

## Procedure
1. Clarify desired business and engineering outcomes.
2. Identify hard constraints and non-functional requirements.
3. Inspect current architecture and delivery reality.
4. Identify the few decisions that materially shape the solution.
5. Compare feasible approaches and trade-offs.
6. Define guiding principles and explicit non-goals.
7. Break direction into reversible milestones.
8. Assign decision ownership.
9. Communicate rationale and expected evidence.
10. Reassess when assumptions change.

## Decision points
Standardize when consistency lowers system-wide cost; allow autonomy when local optimization is safe. Prefer reversible choices under uncertainty.

## Common failure patterns
Architecture by preference, excessive prescription, ignoring team capability, vague principles, and plans detached from production evidence.

## Verification
Teams can explain the direction, key trade-offs, ownership, and how success will be measured.

## Expected output
A concise, actionable technical direction with decisions, constraints, rationale, risks, and validation signals.

## Stop conditions
Escalate when business goals conflict, critical constraints are unknown, or decisions require authority outside the team.