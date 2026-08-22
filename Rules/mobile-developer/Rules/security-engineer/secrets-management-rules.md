# Secrets Management Rules

## Purpose
Prevent unauthorized disclosure or misuse of credentials and cryptographic material.

## Scope
Applies to application secrets, API keys, certificates, tokens, signing keys, and service credentials.

## MUST
- Secrets MUST be stored in approved secret-management systems and injected at runtime where practical.
- Secret access MUST follow least privilege and be auditable.
- Rotation procedures MUST exist for production secrets and compromised material.
- Secret exposure MUST trigger revocation or rotation based on assessed risk.
- Repositories and CI pipelines MUST be scanned for accidental secret disclosure.

## MUST NOT
- MUST NOT commit active secrets to source control.
- MUST NOT log secrets, tokens, private keys, or reusable authentication material.
- MUST NOT distribute production secrets through chat, tickets, or unprotected documents.

## SHOULD
- Prefer short-lived credentials and managed identity mechanisms.
- Minimize the number of systems and people able to retrieve raw secrets.

## Exceptions
Any exception requires documented reason, compensating controls, expiration, and owner approval.

## Verification
Use secret scanners, vault audit logs, configuration inspection, access reviews, and rotation evidence.