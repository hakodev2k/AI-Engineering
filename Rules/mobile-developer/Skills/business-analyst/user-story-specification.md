# User Story Specification

## Purpose
Translate business needs into implementation-ready user stories without losing business intent, constraints, or traceability.

## When to use
Use when a delivery team works iteratively and needs clear, testable slices of value.

## Inputs
Business objectives, requirements, process models, rules, stakeholder needs, dependencies, and technical constraints.

## Preconditions
The problem and intended outcome are sufficiently understood.

## Context to inspect
Existing backlog conventions, system boundaries, personas, data, integrations, non-functional constraints, and release goals.

## Core knowledge
A user story is a planning and conversation artifact, not a miniature specification. Senior BAs keep stories outcome-focused, independently testable where possible, and connected to business rules and acceptance criteria.

## Procedure
1. Identify the user or actor and desired outcome.
2. Define the smallest valuable behavior slice.
3. Write the story in clear business language.
4. Add context, assumptions, dependencies, and relevant rules.
5. Define acceptance criteria using observable outcomes.
6. Add negative and exception scenarios.
7. Identify data and integration impacts.
8. Check whether the story can be delivered and verified independently.
9. Split oversized stories by workflow step, rule variation, data boundary, or scenario.
10. Review with delivery and QA before commitment.

## Decision points
Use user stories for behavior slices; use supporting specifications or models when complexity would make a story unreadable.

## Common failure patterns
Writing technical tasks as user stories, using vague acceptance criteria, mixing multiple business outcomes, and omitting exception behavior.

## Verification
Confirm the team shares the same understanding, acceptance criteria are testable, and the story traces back to a business objective.

## Expected output
A delivery-ready story with clear value, acceptance criteria, assumptions, dependencies, and traceability.

## Stop conditions
Stop when essential business decisions are unresolved or the story cannot be tested because expected behavior is unknown.