# Credential and Secret Rules

## Purpose
Prevent credential compromise and reduce the blast radius of authentication secrets.

## Scope
Passwords, API keys, client secrets, certificates, private keys, recovery secrets, and privileged credentials.

## MUST
- Secrets MUST be stored only in approved secret-management systems or platform-native protected stores.
- Secret access MUST be restricted, auditable, and attributable.
- Rotation intervals and emergency rotation procedures MUST reflect credential risk and exposure.
- Compromised or suspected-compromised credentials MUST be revoked or rotated promptly.
- Secret distribution MUST avoid plaintext channels and unnecessary duplication.

## MUST NOT
- MUST NOT commit credentials to source control, documentation, tickets, or chat.
- MUST NOT log secrets, tokens, private keys, or password-equivalent material.
- MUST NOT use one shared credential across unrelated systems when separate credentials are feasible.

## SHOULD
- Short-lived credentials SHOULD replace static credentials where supported.
- Automated rotation SHOULD be preferred when it preserves service continuity.

## Exceptions
Any long-lived or manually managed secret requires documented owner, reason, rotation control, monitoring, and expiry review.

## Verification
Inspect secret stores, access logs, repository scans, rotation records, revocation evidence, and samples of credential usage.