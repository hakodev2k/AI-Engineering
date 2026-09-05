# Analytics Testing Rules

## Purpose
Provide deterministic regression protection for analytical transformations and business logic.

## Scope
Applies to schema tests, data tests, unit tests, reconciliation tests, integration tests, and regression tests.

## MUST
- Critical business logic MUST have tests covering normal cases and material edge cases.
- Key uniqueness, referential integrity, accepted-value, and nullability assumptions MUST be tested where they affect correctness.
- Tests MUST be deterministic for a controlled input state.
- Bug fixes MUST add regression protection when the failure can reasonably recur.
- Test failures MUST block promotion when they indicate incorrect trusted outputs.

## MUST NOT
- MUST NOT use broad row-count checks as the only validation for critical transformations.
- MUST NOT disable failing tests without documented root cause, owner, and remediation plan.
- MUST NOT treat flaky tests as harmless; they MUST be investigated or explicitly quarantined.

## SHOULD
- Use small fixture-based tests for complex business rules and larger integration tests for cross-model behavior.
- Reconcile important outputs against an independent trusted calculation when practical.

## Exceptions
Exceptions require documented limitation, alternative evidence, risk, and approval.

## Verification
Inspect test definitions, CI results, fixtures, failure history, reconciliations, and blocked promotions.