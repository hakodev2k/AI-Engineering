# Payment Testing Rules

## Purpose
Protect critical financial paths with deterministic tests that cover normal, duplicate, delayed, and failure behavior.

## Scope
Unit, integration, contract, end-to-end, provider-sandbox, concurrency, and failure-injection testing.

## MUST
- Critical money-moving paths MUST have integration coverage for success, rejection, timeout, retry, duplicate delivery, and recovery.
- Tests MUST verify financial effects and authoritative state, not only HTTP responses.
- Provider integrations MUST have contract tests or equivalent validated simulations.
- Concurrency-sensitive idempotency and refund behavior MUST be tested under parallel execution.
- Regression tests MUST be added for financially material production defects.

## MUST NOT
- MUST NOT use real production credentials or live customer funds in automated tests.
- MUST NOT accept flaky tests on critical payment paths as normal.
- MUST NOT mock away the persistence or message boundaries whose failure semantics are under test.

## SHOULD
- Use deterministic provider simulators for rare failure modes that sandboxes cannot reproduce reliably.

## Exceptions
Missing automation requires documented alternative evidence, owner, risk, and approval.

## Verification
Inspect test suites, CI history, failure-injection results, coverage of critical paths, and regression cases.