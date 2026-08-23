# Code Review and Refactoring

## Purpose
Improve correctness, maintainability, security, and operability while keeping change risk proportional.

## When to use
Pull-request review, legacy cleanup, feature preparation, repeated defects, or technical-debt reduction.

## Inputs
Change diff, requirements, tests, architecture, coding conventions, runtime evidence.

## Context to inspect
Callers, tests, ownership boundaries, data contracts, performance/security implications, deployment behavior.

## Core knowledge
Review outcomes and risks, not style preferences. Refactoring preserves observable behavior while improving structure; large rewrites require stronger justification and migration evidence.

## Procedure
1. Understand intended behavior and acceptance criteria.
2. Inspect changed code plus affected callers/contracts.
3. Check correctness and edge cases first.
4. Review authorization, validation, concurrency, and data integrity.
5. Assess performance and operational effects.
6. Evaluate tests against actual risk.
7. Identify duplication or coupling that materially raises change cost.
8. Suggest the smallest useful structural improvement.
9. Separate blocking defects from optional suggestions.
10. Verify refactoring with existing and added regression tests.

## Decision points
Refactor inline when scope is bounded and verification strong; defer broad cleanup when it obscures a risky functional change. Rewrite only when incremental migration is demonstrably worse.

## Common failure patterns
Style-only reviews, approving because tests pass, speculative abstractions, huge mixed refactors, missing callers, and comments without rationale.

## Verification
Build and tests pass; behavior remains stable; identified risks are covered; diff is understandable and deployment implications reviewed.

## Expected output
Actionable review findings or a behavior-preserving refactor with evidence.

## Stop conditions
Escalate unclear requirements, unsafe migration scope, or security-sensitive changes needing specialist approval.