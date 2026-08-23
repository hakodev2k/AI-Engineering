# Quality-Focused Code Review

## Purpose
Review changes for correctness, testability, failure behavior, observability, and regression risk beyond style concerns.

## When to use
Use during pull-request review for behaviorally significant changes.

## Inputs
Diff, requirements, tests, architecture context, incident history.

## Context to inspect
Inspect affected boundaries, validation, error handling, concurrency, data consistency, external calls, tests, and telemetry.

## Core knowledge
Review the behavioral delta and its risks. Tests are evidence, not proof. Senior review asks what can fail, how it is detected, and whether the design remains maintainable.

## Procedure
1. Understand intended behavior and acceptance evidence.
2. Identify changed contracts and state transitions.
3. Trace failure and edge paths.
4. Review authorization and validation implications.
5. Inspect concurrency and consistency risks.
6. Assess test coverage at appropriate levels.
7. Check diagnostics and operational behavior.
8. Distinguish blocking correctness issues from optional improvements.
9. Request evidence for uncertain high-risk claims.
10. Re-review changed areas after fixes.

## Decision points
Block on material correctness/security/data risks; avoid blocking on preference when conventions permit alternatives.

## Common failure patterns
Style-only review, trusting green tests blindly, speculative rewrites, ignoring deleted behavior, and accepting unobservable failures.

## Verification
Confirm resolved comments map to code/tests/evidence and critical behavior remains covered.

## Expected output
Concise risk-focused review findings with actionable rationale.

## Stop conditions
Escalate when requirements conflict, security ownership is required, or the change exceeds reviewable scope.