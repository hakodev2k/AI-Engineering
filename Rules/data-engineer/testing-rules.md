# Testing Rules
## Purpose
Protect data correctness across transformations, integrations, and failure modes.
## Scope
Unit, integration, contract, reconciliation, and end-to-end data tests.
## MUST
- Critical transformations MUST have tests for expected inputs, edge cases, and invalid data.
- Integration tests MUST validate real serialization, schema, and storage behavior where practical.
- Regression fixes MUST add evidence that the defect cannot silently recur.
## MUST NOT
- MUST NOT rely only on row counts as proof of correctness.
- MUST NOT accept flaky data tests as reliable release evidence.
## SHOULD
- Prefer deterministic fixtures and representative production-like distributions without sensitive data.
## Exceptions
Manual validation may supplement automation for rare cases when retained evidence is available.
## Verification
Inspect CI results, fixtures, contract tests, reconciliation checks, and failure coverage.