# Requirements Validation

## Purpose
Prove that requirements are correct, complete enough, consistent, feasible, testable, and aligned with the intended business outcome before commitment.

## When to use
Use before development commitment, baseline approval, major design decisions, release scope confirmation, or after material requirement changes.

## Inputs
Requirements, business rules, process models, acceptance criteria, data definitions, NFRs, constraints, and stakeholder decisions.

## Preconditions
The requirement set is mature enough to review as a coherent scope.

## Context to inspect
Objectives, dependencies, assumptions, edge cases, existing behavior, implementation constraints, tests, and conflicting requirements.

## Core knowledge
Validation asks whether the right requirement was captured; verification asks whether an artifact conforms to its specification. Senior BAs use examples and counterexamples to expose ambiguity early.

## Procedure
1. Trace each requirement to a business objective or mandatory constraint.
2. Check wording for ambiguity and hidden assumptions.
3. Review consistency across rules, processes, data, interfaces, and NFRs.
4. Identify missing exception and boundary scenarios.
5. Confirm acceptance criteria are observable and testable.
6. Review feasibility with engineering and operational stakeholders.
7. Walk representative end-to-end scenarios.
8. Resolve contradictions and duplicate requirements.
9. Record remaining assumptions and risks explicitly.
10. Obtain agreement from accountable business owners.

## Decision points
Use prototypes, examples, or models when text alone leaves material interpretation risk.

## Common failure patterns
Treating stakeholder approval as proof of quality, validating items in isolation, ignoring non-functional needs, and leaving assumptions implicit.

## Verification
Confirm no critical requirement lacks rationale, testability, ownership, or dependency context and representative scenarios are internally consistent.

## Expected output
A validated requirement baseline or backlog state with resolved defects, explicit assumptions, and approval evidence.

## Stop conditions
Stop when unresolved contradictions could materially change implementation or business outcome.