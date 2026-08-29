# Integration Testing and Contract Validation Rules

## Purpose
Provide deterministic evidence that integration behavior remains correct across boundaries and failure modes.

## Scope
Applies to unit, contract, integration, end-to-end, compatibility, and failure-path testing.

## MUST
- Critical contracts MUST have automated validation against representative producer and consumer behavior where practical.
- Tests MUST cover malformed input, missing required data, duplicate delivery, timeout, dependency failure, and recovery behavior when relevant.
- Test fixtures MUST reflect real contract semantics without containing production secrets or unnecessary sensitive data.
- Tests MUST verify side effects and state transitions, not only transport-level status codes.
- Breaking contract changes MUST be detected before production rollout.

## MUST NOT
- MUST NOT rely exclusively on manually executed happy-path tests for critical integrations.
- MUST NOT hide flaky integration tests with unbounded retries.
- MUST NOT mock away the boundary being validated in a test intended to prove interoperability.

## SHOULD
- Consumer-driven or schema compatibility testing SHOULD be used where multiple independent consumers exist.
- Production-like environments SHOULD be used for protocol and infrastructure behavior that cannot be represented locally.

## Exceptions
Document missing coverage, risk, alternative evidence, owner, and remediation plan.

## Verification
Inspect test suites, CI results, contract-test reports, failure-path coverage, fixtures, and release gates.