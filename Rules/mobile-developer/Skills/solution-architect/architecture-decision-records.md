# Architecture Decision Records

## Purpose
Capture significant architecture decisions with enough context and rationale for future teams to understand, challenge, and evolve them.

## When to use
Use for decisions with meaningful cost, coupling, risk, migration impact, or long-term consequence.

## Inputs
Problem statement, decision drivers, options, evidence, constraints, stakeholders, consequences.

## Preconditions
The decision is important enough to outlive a code review or meeting note.

## Context to inspect
Existing ADRs, architecture principles, standards, constraints, dependent decisions, current system state.

## Core knowledge
An ADR records context, decision, alternatives, rationale, and consequences. It should preserve why a choice was made, not only what was chosen.

## Procedure
1. State the decision problem precisely.
2. Record relevant context and constraints.
3. List realistic alternatives.
4. Compare alternatives against explicit drivers.
5. Capture evidence and assumptions.
6. State the decision clearly.
7. Record positive and negative consequences.
8. Identify follow-up actions and dependencies.
9. Assign status and decision date.
10. Link superseding ADRs rather than rewriting history.

## Decision points
Create one ADR per cohesive decision. Avoid ADRs for trivial implementation details. Supersede instead of silently editing finalized rationale.

## Common failure patterns
Decision-only ADRs, missing rejected options, generic pros/cons, hidden assumptions, retroactive justification, stale status.

## Verification
A new team member can explain why the decision exists and what would cause it to be revisited.

## Expected output
Concise, traceable ADR with accepted trade-offs.

## Stop conditions
Stop when evidence is insufficient for an irreversible or high-cost decision.