# Access Control

## Purpose
Limit database privileges to authorized identities and necessary operations.

## Scope
Human, service, automation, administrative, and emergency access.

## MUST
- Database access MUST use attributable identities and least privilege appropriate to job function.
- Privileged access MUST be reviewed periodically and removed promptly when no longer required.
- Administrative and application identities MUST be separated where practical.
- Emergency elevation MUST be time-bounded, approved, and auditable.

## MUST NOT
- MUST NOT share personal administrator credentials.
- MUST NOT grant broad ownership or superuser rights merely to resolve ordinary permission errors.
- MUST NOT embed database passwords or tokens in source code or operational documentation.
- MUST NOT bypass authorization controls without explicit security approval.

## SHOULD
- Role-based grants SHOULD be preferred over repetitive direct user grants.
- Authentication SHOULD integrate with centrally governed identity where supported.

## Exceptions
Exceptions require business justification, exact privileges, duration, compensating controls, risk owner, and approval.

## Verification
Inspect grants, role memberships, privileged-login history, dormant accounts, credential storage, access-review evidence, and emergency-access records.