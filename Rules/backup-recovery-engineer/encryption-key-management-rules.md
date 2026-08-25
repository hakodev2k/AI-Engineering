# Encryption and Key Management

## Purpose
Keep backup data confidential without making recovery dependent on unavailable keys.

## Scope
Encryption in transit and at rest, keys, certificates, escrow, rotation, and recovery credentials.

## MUST
- Sensitive backup data MUST be encrypted in transit and at rest using approved mechanisms.
- Recovery of encryption keys MUST be documented and tested independently of the failed production system.
- Key access MUST follow least privilege and be auditable.
- Key rotation or retirement MUST preserve the ability to decrypt retained backups for their required lifetime.

## MUST NOT
- MUST NOT store plaintext keys or recovery secrets with the backup data they protect.
- MUST NOT rotate, revoke, or destroy keys without evaluating retained backup dependencies.
- MUST NOT log encryption secrets.

## SHOULD
- Key custody SHOULD use separation of duties for high-impact recovery sets.

## Exceptions
Exceptions require security review, explicit residual-risk acceptance, compensating controls, and expiry.

## Verification
Inspect encryption configuration, key permissions, rotation records, restore tests using escrowed/recovered keys, and audit logs.