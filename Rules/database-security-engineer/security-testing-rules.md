# Database Security Testing Rules

## Purpose
Provide evidence that database security controls enforce intended boundaries under normal and adversarial conditions.

## Scope
Covers authentication, authorization, injection defenses, isolation, encryption, configuration, auditing, and recovery security.

## MUST
- Security tests MUST include negative cases proving unauthorized identities and inputs are rejected.
- Tests MUST exercise representative application, administrative, migration, and recovery paths according to risk.
- Findings MUST identify affected control, reproducible evidence, severity rationale, and remediation owner.
- Test data and environments MUST be protected according to their sensitivity.
- Remediation MUST be retested before a finding is considered closed.

## MUST NOT
- Passing happy-path tests MUST NOT be treated as evidence of authorization correctness.
- Production-destructive testing MUST NOT occur without explicit authorization and safety controls.
- Scanner output MUST NOT be accepted as fact without validation of material findings.

## SHOULD
- Automate stable security regression tests in CI or controlled deployment gates.
- Combine static, configuration, integration, and manual testing where each covers different failure modes.

## Exceptions
Omitted tests require documented reason, residual risk, alternative evidence, and reviewer approval.

## Verification
Review test cases, identity matrices, CI results, scanner validation, finding lifecycle, retest evidence, and coverage against current database threat scenarios.