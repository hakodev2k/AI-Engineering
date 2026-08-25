# Security and Access Rules
## Purpose
Protect PostgreSQL identities, privileges, and data boundaries.
## Scope
Roles, grants, ownership, row-level security, authentication, and network access.
## MUST
- Apply least privilege and separate ownership from routine application access.
- Review PUBLIC privileges and default privileges for newly created objects.
- Test row-level security from the effective application role when used.
- Require approval for high-risk production privilege escalation.
## MUST NOT
- Run applications as superuser or object owner without a documented necessity.
- Weaken authentication or authorization controls merely to unblock operations.
## SHOULD
- Use role groups and time-bounded privileged access.
## Exceptions
Emergency elevation must be auditable, scoped, approved, and revoked promptly.
## Verification
Inspect role memberships, grants, ownership, pg_hba configuration, RLS policies, and access tests.