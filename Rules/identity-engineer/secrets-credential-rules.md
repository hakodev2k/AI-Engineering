# Secrets and Credentials
## Purpose
Protect identity credentials throughout their lifecycle.
## Scope
Passwords, API credentials, signing keys, certificates, recovery secrets, and client secrets.
## MUST
- Secrets MUST be stored using approved secret-management controls and access MUST be least-privileged.
- Credential issuance, rotation, revocation, and compromise response MUST be defined.
- Suspected exposed credentials MUST be treated as compromised until evidence supports otherwise.
## MUST NOT
- Secrets MUST NOT be committed to source, tickets, logs, telemetry, or documentation.
- Rotation MUST NOT leave obsolete credentials valid beyond the approved overlap.
## SHOULD
- Prefer generated, scoped, short-lived credentials.
## Exceptions
Require documented limitation, compensating controls, expiry, and approval.
## Verification
Secret scanning, vault policy review, rotation tests, access logs, and revocation validation.