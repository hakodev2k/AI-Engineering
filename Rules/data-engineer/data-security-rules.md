# Data Security Rules
## Purpose
Protect data platforms against unauthorized access and accidental exposure.
## Scope
Storage, pipelines, compute, service identities, credentials, and access controls.
## MUST
- Access MUST follow least privilege and be scoped to required datasets and operations.
- Service credentials MUST use approved secret-management and rotation mechanisms.
- Sensitive data access MUST be auditable.
- High-risk access changes MUST require explicit approval.
## MUST NOT
- MUST NOT embed secrets in code, notebooks, logs, or pipeline definitions.
- MUST NOT grant broad production access merely to simplify troubleshooting.
## SHOULD
- Prefer managed identities, short-lived credentials, and role-based access.
## Exceptions
Temporary elevated access requires owner, reason, expiry, and audit evidence.
## Verification
Inspect IAM policies, secret scans, access logs, role assignments, and approval records.