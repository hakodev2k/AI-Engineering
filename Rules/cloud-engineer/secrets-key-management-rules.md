# Secrets and Key Management Rules
## Purpose
Protect credentials, keys, certificates, and cryptographic material.
## Scope
Secret stores, encryption keys, certificates, tokens, rotation, and application access.
## MUST
- Secrets MUST be stored in approved secret-management systems and access MUST be auditable.
- Rotation and revocation procedures MUST exist for credentials whose compromise can affect production.
- Cryptographic keys MUST have explicit ownership, lifecycle, and access policy.
## MUST NOT
- MUST NOT commit secrets to source control, images, templates, logs, or plaintext configuration.
- MUST NOT expose secret values in diagnostics or CI output.
## SHOULD
- Prefer automatic rotation and short-lived credentials when supported.
## Exceptions
Temporary exceptions require risk, expiry, compensating controls, migration plan, and approval.
## Verification
Use secret scanning, configuration inspection, IAM review, rotation records, audit logs, and repository history checks.