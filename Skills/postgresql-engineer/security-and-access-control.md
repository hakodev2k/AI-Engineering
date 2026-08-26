# Security and Access Control

## Purpose
Apply least privilege, secure authentication, encrypted transport, and controlled object ownership in PostgreSQL.

## When to use
Use for role design, access reviews, new applications, security incidents, or compliance hardening.

## Inputs
Actors, required operations, database objects, authentication architecture, compliance requirements.

## Context to inspect
Roles/memberships, ownership, grants, default privileges, pg_hba rules, TLS, secrets handling, SECURITY DEFINER functions and extensions.

## Core knowledge
Separate login identities from privilege roles where useful. Ownership conveys powerful rights. Schema CREATE privileges, search_path, function execution and default privileges can create escalation paths.

## Procedure
1. Inventory identities and required capabilities.
2. Remove broad/shared privileges where feasible.
3. Design role hierarchy around least privilege.
4. Control database/schema/table/sequence/function privileges.
5. Review ownership and default privileges.
6. Harden authentication and TLS.
7. Secure search_path and privileged functions.
8. Rotate credentials through approved secret management.
9. Test denied as well as allowed actions.
10. Audit periodically.

## Decision points
Use row-level security only when tenant/data-policy requirements justify its complexity and tests cover policy interactions.

## Common failure patterns
Application as superuser/owner, PUBLIC privileges, unsafe SECURITY DEFINER, credential reuse, relying on network isolation alone.

## Verification
Test with real role identities, enumerate effective privileges, verify encrypted connections and audit evidence.

## Expected output
Role/grant model, hardening changes, verification matrix.

## Stop conditions
Escalate before revoking production access whose consumers cannot be confidently identified.