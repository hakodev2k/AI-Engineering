# Backlog Refinement

## Purpose
Keep upcoming work understandable, prioritized, sufficiently analyzed, and ready for delivery without over-specifying distant work.

## When to use
Use continuously in iterative delivery and before planning or commitment sessions.

## Inputs
Product goals, roadmap, backlog, dependencies, requirements, defects, technical constraints, and stakeholder priorities.

## Preconditions
A prioritized source of candidate work exists and decision owners are available for unresolved business questions.

## Context to inspect
Near-term goals, dependency order, acceptance criteria, business rules, scope assumptions, historical defects, team capacity, and release constraints.

## Core knowledge
Refinement reduces uncertainty just enough for the next decision. Senior BAs balance readiness with waste: detail near-term items deeply and keep distant items lighter until priority stabilizes.

## Procedure
1. Review the highest-priority upcoming items.
2. Confirm each item has a clear business outcome.
3. Remove duplicates and stale requests.
4. Clarify scope boundaries and assumptions.
5. Add or validate acceptance criteria and relevant business rules.
6. Identify dependencies, data needs, integration impacts, and NFRs.
7. Split oversized items into valuable slices.
8. Surface unresolved questions and assign owners.
9. Review feasibility and testability with engineering and QA.
10. Reorder or defer items when new evidence changes priority.

## Decision points
Refine only as far ahead as needed for delivery confidence. Split by business value or scenario before splitting by technical layer.

## Common failure patterns
Refining the entire backlog equally, treating refinement as estimation only, carrying obsolete items indefinitely, and accepting technically sliced stories with no independent value.

## Verification
Confirm near-term items meet the team's readiness standard, material dependencies are visible, and unresolved questions have owners.

## Expected output
A prioritized near-term backlog with clear scope, acceptance conditions, dependencies, and manageable uncertainty.

## Stop conditions
Stop detailed refinement when priority is too uncertain or a critical business decision must occur first.