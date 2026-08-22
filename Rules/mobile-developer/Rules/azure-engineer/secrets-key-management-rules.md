# Secrets and Key Management Rules

## Purpose
Prevent credential disclosure and unsafe cryptographic key handling.

## Scope
Azure Key Vault, secrets, certificates, encryption keys, rotations, access policies, RBAC, and application configuration.

## MUST
- Store sensitive credentials and keys in approved secret-management systems.
- Grant secret and key access only to identities that require it.
- Define rotation and expiry expectations for credentials that cannot be eliminated.
- Enable recoverability protections appropriate to production key vaults.
- Treat key deletion, purge, and rotation as potentially destructive operations.

## MUST NOT
- Put secrets in source code, CI logs, tickets, templates, or ordinary application settings.
- Rotate production secrets or keys without assessing dependent consumers and rollback.
- Disable vault protections merely to simplify cleanup.

## SHOULD
- Prefer secretless managed-identity authentication.
- Monitor access anomalies and impending expirations.

## Exceptions
Exceptions require security approval, bounded duration, compensating controls, and a remediation date.

## Verification
Inspect Key Vault configuration, access assignments, secret references, expiry metadata, audit logs, and repository scans.