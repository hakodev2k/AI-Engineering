# Security and Access Rules

## Purpose
Protect distributed data systems from unauthorized access and privilege abuse.

## Scope
Authentication, authorization, service identities, administrative access, network exposure, and secrets.

## MUST
- Database access MUST use authenticated identities with least privilege.
- Administrative access MUST be auditable and separated from application identities.
- Secrets MUST be managed outside source code and rotated through approved mechanisms.
- Network access MUST be restricted to required trust boundaries.

## MUST NOT
- MUST NOT use shared privileged credentials for routine application access.
- MUST NOT disable authentication, TLS, or authorization to bypass operational issues.
- MUST NOT grant broad wildcard privileges without documented necessity and review.

## SHOULD
- Short-lived credentials and workload identity SHOULD be preferred where supported.

## Exceptions
Emergency elevation requires time bounds, approval, audit trail, and prompt revocation.

## Verification
Inspect IAM policies, database grants, network rules, secret scanners, authentication logs, and access reviews.