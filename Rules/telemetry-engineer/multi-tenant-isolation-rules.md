# Multi-Tenant Isolation Rules

## Purpose
Prevent telemetry from crossing tenant, customer, or security boundaries.

## Scope
Tenant identifiers, collectors, routing, storage partitions, caches, queries, dashboards, and exports.

## MUST
- Tenant identity MUST be derived from an authenticated or trusted source before routing or authorization decisions.
- Telemetry storage and query paths MUST enforce required tenant isolation.
- Shared collectors and pipelines MUST preserve tenant metadata without allowing one tenant to overwrite another tenant's identity.
- Cross-tenant administrative access MUST be auditable and least-privileged.

## MUST NOT
- MUST NOT trust tenant identifiers supplied only by unverified client payloads.
- MUST NOT mix tenant data in caches, exports, or dashboards without explicit authorization.
- MUST NOT remove isolation controls to simplify operations.

## SHOULD
- Test isolation at ingestion, storage, and query layers independently.

## Exceptions
Require security review, business justification, explicit authorization, and compensating controls.

## Verification
Inspect authorization policy, routing rules, tenancy tests, storage partitioning, query filters, and audit logs.