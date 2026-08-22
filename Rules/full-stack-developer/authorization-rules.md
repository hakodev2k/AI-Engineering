# Authorization Rules

## Purpose
Ensure every protected operation is authorized at a trusted boundary.
## Scope
UI permissions, APIs, domain operations, and data access.
## MUST
- Enforce authorization server-side for every protected resource and action.
- Evaluate ownership, tenant, role, and policy constraints using trusted identity data.
- Deny by default when authorization context is incomplete.
## MUST NOT
- Treat hidden UI controls as authorization.
- Accept client-supplied privilege claims without trusted verification.
## SHOULD
- Centralize policies and test privilege boundaries including negative cases.
## Exceptions
Public resources must be explicitly classified as public.
## Verification
Run authorization tests across roles/tenants and inspect server policy enforcement.