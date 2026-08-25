# Authorization and Access Control Testing Rules

## Purpose
Verify that privileges are enforced consistently across resources, functions, tenants, and trust boundaries.

## Scope
Covers RBAC, ABAC, object authorization, tenant isolation, administrative boundaries, and privilege transitions.

## MUST
- MUST build a role-resource-action matrix for security-critical paths.
- MUST test horizontal and vertical authorization using controlled identities and owned test objects.
- MUST verify enforcement at the authoritative server or service boundary, not only presentation layers.
- MUST test indirect references, alternate endpoints, batch operations, and state transitions where they can bypass intended policy.
- MUST document the exact principal, object, action, expected decision, and observed decision for findings.

## MUST NOT
- MUST NOT access unrelated customer or employee data beyond minimum authorized evidence.
- MUST NOT infer tenant isolation from identifier unpredictability.
- MUST NOT escalate privileges in a way that changes durable production access without approval and cleanup.

## SHOULD
- SHOULD prioritize administrative, cross-tenant, ownership-transfer, and delegated-access paths.
- SHOULD verify deny-by-default behavior for missing or malformed authorization context.

## Exceptions
Testing that requires durable privilege changes or access to non-test data requires explicit approval, minimization, and audit logging.

## Verification
Review authorization matrices, test identities, owned-object inventory, request/response evidence, access logs, privilege changes, and cleanup records. Reproduce critical bypasses with least-privileged accounts.