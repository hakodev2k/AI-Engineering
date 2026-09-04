# Privacy Testing and Verification Rules

## Purpose
Require evidence that privacy controls work under normal, failure, and abuse conditions.

## Scope
Applies to access controls, consent enforcement, deletion, redaction, minimization, residency, exports, anonymization, and privacy-sensitive integrations.

## MUST
- Privacy-critical controls MUST have deterministic automated tests where practical.
- Tests MUST include negative cases proving unauthorized or disallowed processing is rejected.
- Deletion and revocation workflows MUST be tested end to end across material downstream systems.
- Production-readiness claims MUST distinguish tested behavior from assumptions or documentation-only controls.
- Test data MUST avoid unnecessary use of real personal data.

## MUST NOT
- Passing unit tests MUST NOT be treated as sufficient evidence for distributed privacy workflows that depend on multiple systems.
- Security or privacy controls MUST NOT be disabled in tests in ways that hide production failures.
- Manual verification MUST NOT be claimed without recording the evidence inspected.

## SHOULD
- Regression suites SHOULD cover previously observed privacy defects.
- Policy-as-code and static checks SHOULD enforce stable rules such as prohibited fields, regions, or logging patterns.

## Exceptions
Exceptions require documented reason automated verification is impractical, explicit manual evidence requirements, risk, and reviewer approval.

## Verification
Inspect test suites, CI results, policy checks, test datasets, end-to-end evidence, and failure-injection results. Confirm critical controls have repeatable proof.