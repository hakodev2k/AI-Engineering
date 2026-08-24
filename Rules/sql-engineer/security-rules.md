# Database Security Rules

## Purpose
Protect database confidentiality, integrity, and availability against unauthorized or unsafe SQL access.

## Scope
SQL code, database identities, privileges, dynamic SQL, administrative operations, and data access boundaries.

## MUST
- Database identities MUST receive least privilege required for their workload.
- Untrusted values MUST be bound as parameters or handled through an equivalently safe mechanism.
- Privileged operations MUST be auditable and separated from routine application access.
- Security-sensitive changes MUST identify affected principals, objects, and blast radius.

## MUST NOT
- MUST NOT concatenate untrusted input into executable SQL.
- MUST NOT embed credentials or long-lived secrets in SQL source, migration files, or scripts.
- MUST NOT grant broad administrative privileges merely to resolve permission errors.
- MUST NOT weaken security controls without explicit human approval.

## SHOULD
- Separate read, write, migration, and administrative identities where operationally practical.
- Prefer deny-by-default access patterns and controlled elevation.

## Exceptions
Privilege exceptions require owner, justification, duration, risk, compensating controls, and approval.

## Verification
Inspect grants/roles, scan source for unsafe dynamic SQL and secrets, test authorization boundaries, review audit configuration, and verify effective permissions using non-admin identities.