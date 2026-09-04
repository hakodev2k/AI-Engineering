# Secrets and Credential Rules

## Purpose
Prevent credential exposure, uncontrolled persistence, and unsafe rotation practices.

## Scope
Applies to passwords, API credentials, client secrets, private keys, recovery codes, and other identity authentication material.

## MUST
- Secrets MUST be stored only in approved secret-management or protected credential stores.
- Credential access MUST be least-privileged and auditable.
- Rotation procedures MUST be tested before emergency use.
- Suspected credential exposure MUST trigger containment and rotation according to incident severity.
- Credential lifetime MUST reflect compromise impact and rotation capability.

## MUST NOT
- Secrets MUST NOT be committed to source control, tickets, chat logs, documentation, or plaintext configuration.
- Production credentials MUST NOT be reused across environments.
- Secret rotation MUST NOT be performed without understanding dependent systems and rollback implications.

## SHOULD
- Prefer short-lived, dynamically issued credentials over static secrets.
- Secret scanning SHOULD run in CI and repository history where supported.

## Exceptions
Exceptions require documented technical constraint, owner, expiry, compensating controls, and approval.

## Verification
Inspect secret stores, repository scanners, credential inventories, access logs, rotation evidence, and dependency configuration.