# Security and Isolation Rules

## Purpose
Prevent unauthorized memory access, cross-user leakage, and privilege escalation through memory systems.

## Scope
Authentication, authorization, tenancy, namespaces, encryption, and service access.

## MUST
- Memory reads and writes MUST be authorized using the requesting identity and intended scope.
- Tenant and user namespaces MUST be isolated at storage, index, and cache boundaries.
- Sensitive memory stores MUST use encryption controls appropriate to their classification.
- Administrative memory access MUST be auditable.

## MUST NOT
- MUST NOT rely on prompt instructions as the primary authorization boundary.
- MUST NOT use globally shared cache keys that can collide across users or tenants.
- MUST NOT expose credentials, tokens, or secrets through memory content or telemetry.

## SHOULD
- Prefer short-lived workload identity over static credentials.
- Periodically test cross-tenant isolation and privilege boundaries.

## Exceptions
Break-glass access requires explicit authorization, time bounds, logging, and post-event review.

## Verification
Inspect IAM policy, namespace design, isolation tests, encryption configuration, and audit logs.