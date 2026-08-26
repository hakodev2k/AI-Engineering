# Users, Roles, and Least Privilege

## Purpose
Design maintainable MySQL database identities and grants with minimum necessary privilege.

## When to use
Use for onboarding services/operators, access reviews, privilege reduction, or credential separation.

## Inputs
Actors, required operations, schemas/tables, environments, administrative duties, rotation constraints.

## Context to inspect
Existing users, host patterns, roles, grants, definer objects, connection pools, migration jobs, monitoring agents.

## Core knowledge
Privileges should follow job function and environment. Runtime applications rarely need DDL or grant administration. Stored object DEFINER and dynamic privileges require explicit review.

## Procedure
1. Inventory principals and actual responsibilities.
2. Separate human, service, migration, backup, and monitoring identities.
3. Map required operations to the narrowest grants.
4. Prefer roles for reusable privilege sets.
5. Restrict host scope and administrative privileges.
6. Review views/routines/events and DEFINER implications.
7. Apply changes in a lower environment.
8. Test normal and denied operations.
9. Roll out with dependency monitoring.
10. Schedule recurring access review and credential rotation.

## Decision points
Grant schema-level access only when table-level maintenance cost outweighs meaningful risk. Use dedicated migration credentials for DDL rather than expanding runtime accounts.

## Common failure patterns
GRANT ALL, shared users, '%' host unnecessarily, stale accounts, privilege creep, and forgotten DEFINER dependencies.

## Verification
Compare grants to an approved matrix, execute positive/negative tests, and confirm production services function without elevated privileges.

## Expected output
Least-privilege role/grant model and reviewable access matrix.

## Stop conditions
Stop if principal ownership is unknown, access removal may interrupt critical services, or emergency access lacks an approved break-glass process.