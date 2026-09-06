# Security and Access Control Rules

## Purpose
Prevent retrieval from bypassing data access boundaries.

## Scope
Authentication, authorization, tenant isolation, source ACLs, service identities, and auditability.

## MUST
- Retrieval MUST enforce the effective access policy for the requesting identity before restricted content is returned.
- Source ACLs MUST remain represented through ingestion, indexing, and retrieval.
- Service identities MUST use least privilege.
- Cross-tenant isolation MUST be deterministic and tested.
- Privileged configuration changes MUST be auditable and approved.

## MUST NOT
- MUST NOT rely on client-provided tenant or role claims without trusted verification.
- MUST NOT expose restricted snippets through caches, logs, traces, or debugging tools.
- MUST NOT bypass retrieval authorization for operational convenience.

## SHOULD
- Prefer short-lived workload credentials.
- Periodically review privileged index and source access.

## Exceptions
Break-glass access requires time-bounded approval, complete audit logging, and post-event review.

## Verification
Inspect IAM policy, ACL propagation tests, tenant-isolation tests, audit logs, and cache behavior.