# Testing Rules

## Purpose
Protect growth changes against regressions in customer journeys, measurement, and business logic.

## Scope
Automated tests, integration tests, E2E tests, analytics validation, and release verification.

## MUST
- Cover critical growth business rules and failure paths at the lowest reliable test level.
- Test analytics or exposure events when experiment decisions depend on them.
- Add regression protection for confirmed defects with material recurrence risk.

## MUST NOT
- Treat flaky tests as valid release evidence.
- Mock away the integration boundary that is the primary risk being tested.

## SHOULD
- Keep tests deterministic, isolated, and explicit about clocks, identity, randomization, and external dependencies.

## Exceptions
Manual verification may supplement automation for low-frequency or difficult surfaces when evidence and residual risk are documented.

## Verification
Review CI results, test determinism, coverage of critical paths, failure scenarios, event assertions, and representative environment checks.