# Code Review Rules

## Purpose
Ensure flag-related code changes preserve lifecycle, safety, readability, and removal paths.

## Scope
Application code, infrastructure code, tests, and configuration introducing or modifying flags.

## MUST
- Reviewers MUST verify flag purpose, owner, default, lifecycle, and failure behavior.
- Reviews MUST identify both enabled and disabled execution paths and material side effects.
- High-risk flag changes MUST receive review from appropriate domain owners.
- Cleanup implications MUST be visible when introducing temporary branching.

## MUST NOT
- Reviewers MUST NOT approve a flag that silently bypasses authorization or invariant enforcement.
- Nested flag logic MUST NOT be accepted when it creates unbounded or untestable state complexity.
- Existing flag semantics MUST NOT change accidentally through refactoring.

## SHOULD
- Reviews SHOULD prefer centralized evaluation and named decisions over scattered raw flag checks.

## Exceptions
Emergency patches may use expedited review under incident policy but require subsequent full review.

## Verification
Inspect pull-request evidence, tests, ownership rules, static references, and lifecycle metadata.