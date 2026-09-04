# Testing and Conformance Rules

## Purpose
Ensure governed API behavior is verified against contracts, compatibility expectations, and critical failure modes.

## Scope
Applies to contract tests, conformance suites, integration tests, compatibility tests, and governance CI checks.

## MUST
- Supported API operations MUST have automated verification for normative request, response, and error behavior.
- Contract changes MUST run compatibility checks against the previously released contract.
- Security-critical and authorization-critical paths MUST include negative tests.
- Pagination, idempotency, retries, rate limits, and asynchronous delivery MUST be tested when those semantics are part of the contract.
- Conformance failures MUST block release when they indicate a violation of mandatory governance or compatibility requirements.
- Test evidence MUST identify the contract version and implementation version evaluated.

## MUST NOT
- Mock-only tests MUST NOT be treated as sufficient evidence for interoperability-critical behavior.
- Flaky conformance tests MUST NOT be silently ignored or permanently retried until green.
- Passing unit tests MUST NOT be used as evidence that a public contract is backward-compatible.

## SHOULD
- Consumer-driven tests SHOULD supplement provider tests for high-impact integrations.
- Governance linting SHOULD execute in CI before merge.

## Exceptions
Exceptions require a documented verification gap, risk, compensating evidence, approval, and remediation plan.

## Verification
Inspect CI policies, contract-test reports, compatibility diffs, negative tests, flaky-test history, and release evidence. Confirm mandatory failures block deployment.