# Credential and Key Rules

## Purpose
Protect provider credentials, signing secrets, encryption keys, and operational access used by payment systems.

## Scope
API keys, OAuth credentials, webhook secrets, encryption keys, certificates, and privileged payment-service identities.

## MUST
- Secrets MUST be stored in an approved secret-management system and delivered at runtime through controlled mechanisms.
- Production credentials MUST be environment-specific and least-privileged.
- Rotation procedures MUST preserve service continuity and support overlapping validity when required.
- Access and rotation events MUST be auditable.
- Compromised credentials MUST be revoked according to incident procedures.

## MUST NOT
- MUST NOT hard-code secrets in source, images, configuration repositories, or tests.
- MUST NOT log secret values or authentication tokens.
- MUST NOT rotate production credentials without approved execution authority and rollback or recovery planning.

## SHOULD
- Prefer short-lived workload identities over static credentials where providers support them.

## Exceptions
Require security justification, bounded duration, compensating controls, and approval.

## Verification
Use secret scanning, IAM review, configuration inspection, rotation tests, and audit-log review.