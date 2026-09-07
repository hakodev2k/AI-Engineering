# Secrets and Key Rules

## Purpose
Prevent credentials and cryptographic material from becoming persistent trust shortcuts.

## Scope
Applies to passwords, API keys, signing keys, encryption keys, certificates, tokens, and secret-distribution systems.

## MUST
- Secrets MUST be stored and distributed through approved protected mechanisms.
- Secret scope, lifetime, and privileges MUST be minimized.
- Rotation and revocation procedures MUST be defined for sensitive credentials.
- Access to secret-management systems MUST itself follow least privilege and strong authentication.

## MUST NOT
- MUST NOT commit secrets to source control, images, documentation, or plaintext configuration.
- MUST NOT reuse one high-value secret across unrelated trust boundaries.
- MUST NOT log secret values or complete authentication tokens.

## SHOULD
- Prefer short-lived dynamically issued credentials over long-lived static secrets.
- Cryptographic keys SHOULD be non-exportable when platform capabilities permit.

## Exceptions
Static or exportable material requires documented technical need, protected storage, limited consumers, monitoring, rotation schedule, and approval.

## Verification
Use secret scanning, configuration inspection, access-log review, key-usage audit, rotation tests, and incident exercises demonstrating compromised credentials can be revoked without uncontrolled outage.