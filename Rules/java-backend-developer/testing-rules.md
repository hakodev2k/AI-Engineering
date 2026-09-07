# Testing Rules

## Purpose
Provide credible regression evidence for Java backend behavior and failure modes.

## Scope
Applies to unit, integration, contract, end-to-end, concurrency, and failure tests.

## MUST
- Critical business invariants and production-critical integration paths MUST have automated regression coverage.
- Tests MUST be deterministic with controlled time, randomness, external dependencies, and data where practical.
- Persistence behavior that depends on real database semantics MUST be tested against a compatible database engine.
- Security-sensitive paths MUST include negative authorization and validation tests.
- Bug fixes SHOULD add a regression test that fails for the defect when practical.

## MUST NOT
- MUST NOT make flaky tests acceptable by adding arbitrary sleeps or blanket retries.
- MUST NOT mock away the behavior being validated.
- MUST NOT treat high line coverage as proof of meaningful behavioral coverage.

## SHOULD
- Keep unit tests fast and use integration tests for framework, serialization, SQL, transaction, and network semantics.
- Test boundary values and failure modes deliberately.

## Exceptions
Unautomatable behavior requires documented manual verification evidence and rationale.

## Verification
Review CI results, flaky-test history, test isolation, mutation or branch evidence where useful, integration environment fidelity, and traceability from critical risks to tests.