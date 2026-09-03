# Multi-Tenancy

## Purpose
Prevent cross-tenant disclosure and control noisy-neighbor risk in shared vector infrastructure.

## Scope
Applies to tenant isolation, namespaces, partitions, credentials, quotas, filters, and shared capacity.

## MUST
- Tenant identity MUST be established from trusted authentication context and enforced server-side.
- Isolation design MUST cover data, indexes, metadata, caches, logs, backups, and administrative tooling.
- Cross-tenant access tests MUST be part of release verification for shared retrieval paths.
- Resource quotas or equivalent controls MUST bound tenant-induced capacity exhaustion where shared resources exist.
- Operational access to tenant data MUST follow least privilege and auditable authorization.

## MUST NOT
- MUST NOT rely solely on client-supplied filter values for tenant isolation.
- MUST NOT reuse cache entries across tenants unless keys and authorization semantics guarantee isolation.
- MUST NOT expose tenant identifiers or content unnecessarily through telemetry.

## SHOULD
- High-risk tenants SHOULD use stronger physical or logical isolation where threat and compliance requirements justify it.
- Capacity metrics SHOULD support per-tenant attribution.
- Isolation assumptions SHOULD be threat-modeled and revisited after architecture changes.

## Exceptions
Exceptions require security review, documented threat analysis, compensating controls, verification, and explicit approval.

## Verification
Use authorization tests, adversarial queries, configuration inspection, cache-key review, audit logs, quota tests, and security review evidence.