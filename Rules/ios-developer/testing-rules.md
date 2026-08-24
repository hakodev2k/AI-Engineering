# Testing Rules

## Purpose
Provide deterministic regression protection for behavior that is expensive or risky to break.

## Scope
Unit, integration, UI, snapshot, contract, migration, and system tests for iOS code.

## MUST
- Critical business logic and failure-prone boundaries MUST have automated regression coverage appropriate to risk.
- Tests MUST be deterministic with explicit control over time, randomness, network, persistence, and external state where relevant.
- Production bug fixes MUST add regression coverage when the defect is practically reproducible in tests.
- Migration, authentication, purchase, and destructive flows MUST test failure and interruption paths when applicable.
- Test failures MUST identify actionable behavior rather than depend on arbitrary sleeps.

## MUST NOT
- MUST NOT hide flaky tests behind unlimited retries.
- MUST NOT couple unit tests to live external services.
- MUST NOT treat high coverage percentage as evidence that critical behavior is adequately tested.

## SHOULD
- Use the lowest-cost test level that proves the contract.
- Keep UI tests focused on high-value integration journeys.
- Maintain reusable fixtures without obscuring intent.

## Exceptions
Untested critical behavior requires documented reason, manual verification evidence, risk acceptance, and a follow-up plan.

## Verification
Review CI results, flake history, coverage of critical paths, failure-path tests, test isolation, and reproducibility across supported simulators/devices.