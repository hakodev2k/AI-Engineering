# Testing Rules

## Purpose
Provide deterministic evidence that Salesforce behavior remains correct across platform contexts and edge cases.

## Scope
Applies to Apex tests, LWC tests, integration tests, regression suites, and deployment gates.

## MUST
- Tests MUST assert business outcomes, not only code execution or coverage percentage.
- Apex tests MUST create their own required data unless a controlled exception is documented.
- Critical automation MUST be tested for bulk operations, permissions, failure paths, and relevant async behavior.
- Regression tests MUST accompany fixes for defects with realistic recurrence risk.

## MUST NOT
- MUST NOT use code coverage percentage as the sole quality criterion.
- MUST NOT depend on organization data that can change independently of the test.
- MUST NOT mask flaky or order-dependent tests by retrying them without root-cause investigation.

## SHOULD
- Test factories SHOULD centralize realistic data construction without hiding scenario intent.
- Integration contracts SHOULD have isolated tests with deterministic fixtures.

## Exceptions
Exceptions require reason, scope, risk, and reviewer approval.

## Verification
Run tests repeatedly, inspect assertions, isolate test data, review bulk/security scenarios, and enforce CI gates.