# Testing Strategy Rules

## Purpose
Ensure architecture is protected by tests at the boundaries and risk levels that matter most.

## Scope
Applies to unit, integration, contract, end-to-end, architecture, performance, and failure testing.

## MUST
- Test strategy MUST reflect system risk, critical paths, integration boundaries, and failure modes.
- Architectural invariants that can be automated MUST be enforced by tests or static checks.
- Critical integrations MUST have contract or integration coverage independent of happy-path unit tests.
- High-risk changes MUST include regression evidence appropriate to their blast radius.

## MUST NOT
- MUST NOT rely only on unit tests to validate distributed or persistence behavior.
- MUST NOT use flaky tests as accepted release evidence without active remediation.
- MUST NOT equate high coverage percentage with sufficient architectural verification.

## SHOULD
- Prefer deterministic tests with controlled data and dependencies.
- Prefer a layered test portfolio that gives fast feedback while protecting system boundaries.

## Exceptions
Manual verification may supplement automation for rare scenarios when evidence and repeatability limitations are documented.

## Verification
Review CI gates, architecture tests, contract tests, integration coverage, failure tests, and flake history.