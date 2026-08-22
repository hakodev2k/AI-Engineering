# Requirements and Acceptance Criteria

## Purpose
Translate validated product intent into clear behavioral requirements while preserving room for engineering and design judgment.

## When to use
Use when an opportunity is ready for delivery, multiple teams need a shared contract, or ambiguity could create costly rework.

## Inputs
Problem statement, target users, desired outcomes, designs, domain rules, constraints, risks, analytics needs, and dependencies.

## Context to inspect
Inspect existing product conventions, APIs, permissions, edge cases, data rules, backward compatibility, accessibility, and operational constraints.

## Core knowledge
Requirements should explain user and business behavior, constraints, and success—not prescribe unnecessary implementation. Acceptance criteria make important behavior testable.

## Procedure
1. Restate the user problem and outcome.
2. Define scope and explicit non-scope.
3. Describe primary workflows and actors.
4. Capture domain rules and permissions.
5. Enumerate important edge and failure cases.
6. Define data, analytics, accessibility, security, and compliance needs.
7. Write observable acceptance criteria.
8. Review feasibility and hidden assumptions with engineering and design.
9. Resolve contradictions before implementation.
10. Keep decisions traceable as understanding changes.

## Decision points
Use detailed criteria for risky rules and integrations; use lighter narratives for exploratory UI where prototypes communicate behavior better.

## Common failure patterns
Implementation disguised as requirements, missing error states, ambiguous words such as fast or easy, no non-scope, and changing criteria after development without acknowledging scope impact.

## Verification
Criteria are independently testable, cover critical failure behavior, align with designs and domain rules, and trace to the intended outcome.

## Expected output
A delivery-ready requirement set with scope, behavior, constraints, acceptance criteria, and unresolved decisions.

## Stop conditions
Stop when core business rules conflict, critical design or technical feasibility is unknown, or required decision owners are unavailable.