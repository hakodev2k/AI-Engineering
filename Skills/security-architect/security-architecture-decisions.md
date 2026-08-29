# Security Architecture Decisions

## Purpose
Document consequential security design choices, their context, alternatives, trade-offs, and follow-up obligations so future teams can understand why a control model exists.

## When to use
Use for identity boundaries, cryptographic choices, trust models, segmentation, third-party integrations, exceptions, and other decisions with material long-term impact.

## Inputs
Problem statement, architecture context, threat model, options, constraints, cost and operational impact, risk assessment, stakeholder input.

## Preconditions
At least two plausible alternatives or a consequential design commitment exists.

## Context to inspect
Existing ADRs, platform standards, security policies, dependencies, operational capabilities, incident history, and future roadmap constraints.

## Core knowledge
Good architecture decisions preserve reasoning, not just outcomes. Security choices must record assumptions because threat, platform, and compliance conditions change over time.

## Procedure
1. State the decision scope and security objective.
2. Record relevant threats, assets, and constraints.
3. Enumerate realistic alternatives, including maintaining the current state.
4. Compare risk reduction, operability, availability, performance, cost, and maintainability.
5. Select the option and explain why it is proportionate.
6. Record assumptions, consequences, residual risks, and dependencies.
7. Identify validation evidence and review triggers.
8. Assign ownership for follow-up actions.
9. Revisit the decision when assumptions materially change.

## Decision points
Choose the simplest option that meets security and business objectives with acceptable residual risk. Avoid architectural complexity that cannot be operated consistently.

## Common failure patterns
Recording only the chosen technology, omitting rejected alternatives, hiding assumptions, ignoring operational costs, and never revisiting stale decisions.

## Verification
Confirm the record explains context, alternatives, security rationale, consequences, owner, and measurable validation criteria.

## Expected output
A durable security architecture decision record suitable for engineering and governance review.

## Stop conditions
Stop when key constraints are unknown, decision authority is unclear, or the choice would accept risk beyond the architect's approval authority.