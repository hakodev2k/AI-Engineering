# Access Control Rules

## Purpose
Enforce least privilege for graph discovery, querying, mutation, administration, and export.

## Scope
Users, service identities, graph namespaces, predicates, entity domains, admin APIs, and data exports.

## MUST
- Every production graph operation MUST execute under an authenticated identity.
- Authorization MUST be evaluated at the granularity required by data sensitivity and tenant boundaries.
- Service identities MUST receive only permissions required for their workloads.
- Administrative and bulk-write privileges MUST be auditable.
- High-risk access expansion MUST require human approval.

## MUST NOT
- MUST NOT rely on application convention as the only authorization control.
- MUST NOT expose privileged graph endpoints through unauthenticated interfaces.
- MUST NOT use shared long-lived credentials as the normal operating model.

## SHOULD
- Prefer short-lived workload identity and centralized policy enforcement.
- Periodically review privileged graph access.

## Exceptions
Break-glass access requires incident justification, time bounds, audit logging, and post-event review.

## Verification
Inspect IAM policy, authorization tests, access logs, tenant-isolation tests, and privilege reviews.