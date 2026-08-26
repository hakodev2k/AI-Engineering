# Payment Testing Rules

## Purpose
Provide deterministic evidence that payment behavior remains correct across financial and failure scenarios.

## Scope
Unit, integration, contract, end-to-end, replay, concurrency, and failure testing for payment systems.

## MUST
- Critical financial paths MUST have automated coverage for success, decline, duplicate, timeout, retry, reversal, refund, and provider-error scenarios.
- Tests MUST verify financial side effects, not only HTTP responses or status codes.
- Provider contract tests MUST validate request schemas, response mappings, webhook signatures, and status translations.
- Concurrency tests MUST cover duplicate submissions and competing state transitions where financial duplication is possible.
- Test data MUST avoid real secrets and prohibited production payment data.

## MUST NOT
- MUST NOT mark flaky financial tests as acceptable without bounded remediation.
- MUST NOT use provider sandbox success alone as proof of production correctness.
- MUST NOT omit negative-path tests for irreversible or high-risk operations.

## SHOULD
- Replay fixtures SHOULD cover representative historical provider payloads with sensitive data removed.

## Exceptions
Exceptions require risk justification and explicit manual verification evidence.

## Verification
Inspect test suites, CI results, contract fixtures, mutation or negative-path coverage, concurrency tests, and defect regressions.