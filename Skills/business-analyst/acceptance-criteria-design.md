# Acceptance Criteria Design

## Purpose
Define observable conditions that prove a requirement or story behaves correctly and delivers the intended business outcome.

## When to use
Use for user stories, features, rule changes, integrations, reports, and defects requiring unambiguous expected behavior.

## Inputs
Requirement or story, business rules, process flows, examples, edge cases, data constraints, and non-functional expectations.

## Preconditions
The intended business behavior is understood well enough to state expected outcomes.

## Context to inspect
Related rules, dependencies, existing behavior, validation conventions, error handling, permissions, and affected integrations.

## Core knowledge
Acceptance criteria describe outcomes rather than implementation. They should cover positive, negative, boundary, permission, and exception behavior where relevant.

## Procedure
1. Restate the business outcome.
2. Identify primary scenarios and actors.
3. Capture preconditions that materially affect behavior.
4. Define observable expected outcomes.
5. Add validation and failure scenarios.
6. Add boundary values and important rule combinations.
7. Include authorization and data-integrity behavior where applicable.
8. Check consistency with related requirements.
9. Review with QA and engineering for testability.
10. Validate with the business owner.

## Decision points
Use Given/When/Then when scenario context matters; use concise rule-oriented bullets for simple deterministic behavior.

## Common failure patterns
Restating the story, prescribing code, using subjective words such as fast or correct, and missing negative paths.

## Verification
Ensure each criterion can be proven by a concrete test or observable result and no criterion conflicts with business rules.

## Expected output
A concise, testable set of acceptance criteria covering material scenarios.

## Stop conditions
Escalate when expected outcomes are disputed or cannot be determined from available business authority.