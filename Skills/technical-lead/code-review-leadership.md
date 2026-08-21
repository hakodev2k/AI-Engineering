# Code Review Leadership

## Purpose
Use code review to protect correctness and architecture while improving shared engineering judgment.

## When to use
Use when reviewing significant changes or establishing review standards.

## Inputs
Change set, requirements, tests, architecture, coding standards, production constraints.

## Context to inspect
Inspect affected workflows, boundaries, data changes, security, concurrency, failure behavior, tests, and operational impact.

## Core knowledge
Review should prioritize correctness, risk, maintainability, and learning over stylistic preference. Automated tooling should handle mechanical checks where possible.

## Procedure
1. Understand intent before implementation detail.
2. Assess blast radius and risky paths.
3. Review contracts and boundary changes.
4. Check correctness, failure behavior, concurrency, and security.
5. Evaluate tests against realistic regressions.
6. Check performance and operational consequences where relevant.
7. Distinguish blockers from suggestions.
8. Explain rationale for non-obvious feedback.
9. Prefer small actionable comments.
10. Verify resolved blockers rather than only comment closure.

## Decision points
Block changes for correctness, security, data integrity, severe maintainability, or operational risk. Avoid blocking on preference when multiple valid approaches exist.

## Common failure patterns
Nitpick-heavy reviews, rubber stamping, reviewing only syntax, vague criticism, and redesigning entire features inside comments.

## Verification
Critical risks are addressed, tests support claims, and unresolved trade-offs are explicitly accepted.

## Expected output
Clear prioritized review feedback that improves the change and team capability.

## Stop conditions
Escalate when the change reveals an unresolved architectural or product decision outside review scope.