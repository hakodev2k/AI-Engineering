# Testing and Determinism Rules

## Purpose
Provide repeatable evidence that gameplay changes preserve critical behavior.

## Scope
Unit, integration, simulation, replay, end-to-end, soak, and regression testing.

## MUST
- Critical gameplay invariants and fixed defects MUST have regression protection where automation is practical.
- Automated tests MUST control random seeds, clocks, external state, and asynchronous completion when those affect outcomes.
- Flaky tests MUST be quarantined only temporarily with ownership and remediation tracking.
- Test failures MUST preserve enough state to reproduce or bound the failure.

## MUST NOT
- MUST NOT use arbitrary sleeps as the primary synchronization strategy for deterministic tests.
- MUST NOT treat editor-only success as sufficient evidence for platform-sensitive behavior.

## SHOULD
- Simulation-heavy systems SHOULD support headless execution and replayable fixtures.

## Exceptions
Visual or subjective behavior may require human review, but objective invariants should still be automated where feasible.

## Verification
Inspect CI repeatability, seed replay, failure artifacts, platform suites, soak results, and flaky-test history.