# Multi-Tenancy Isolation

## Purpose
Prevent one tenant from accessing or exhausting another tenant's resources.

## Scope
Identity context, routing, quotas, caches, logs, metrics, and shared platform components.

## MUST
- Tenant identity MUST be derived from trusted authenticated context, not untrusted payload fields alone.
- Authorization, cache keys, quotas, and data routing MUST preserve tenant boundaries.
- Shared-resource failure modes MUST be evaluated for noisy-neighbor impact.
- Administrative cross-tenant operations MUST be explicitly privileged and audited.

## MUST NOT
- MUST NOT accept caller-supplied tenant identifiers as authorization proof.
- MUST NOT expose another tenant's metadata through errors or observability surfaces.

## SHOULD
- Capacity controls SHOULD isolate high-volume tenants where practical.

## Exceptions
Cross-tenant workflows require explicit business purpose, least privilege, auditability, and approval.

## Verification
Run tenant-isolation tests, negative authorization tests, cache tests, quota tests, and audit review.