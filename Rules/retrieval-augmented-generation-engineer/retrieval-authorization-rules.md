# Retrieval Authorization Rules

## Purpose
Ensure retrieval enforces user, tenant, and data-access boundaries before evidence reaches generation.

## Scope
Applies to identity propagation, tenant isolation, ACL filtering, row/document authorization, source permissions, and delegated retrieval.

## MUST
- The requesting principal and tenant context MUST be propagated to every retrieval path that can access restricted content.
- Authorization MUST be enforced before restricted content is returned to context assembly or generation.
- Index metadata used for access decisions MUST be derived from trusted authorization sources and kept synchronized with source permissions.
- Access-control changes MUST define propagation latency and stale-permission handling.
- Missing or invalid identity context MUST fail closed for protected sources.
- Cross-tenant and privilege-boundary tests MUST be part of release verification.

## MUST NOT
- Post-generation redaction MUST NOT be the primary access-control mechanism.
- Cached retrieval results MUST NOT be reused across principals unless the cache key and policy prove equivalent authorization.
- User-supplied tenant or ACL identifiers MUST NOT be trusted without server-side validation.
- Retrieval agents MUST NOT elevate their own privileges to improve answer completeness.

## SHOULD
- Centralize reusable authorization policy rather than duplicating ad hoc filter logic.
- Record authorization decisions in audit telemetry without logging sensitive content unnecessarily.
- Prefer least-privilege service identities for connectors and indexes.

## Exceptions
Any exception that broadens access requires documented business need, security review, expiration or rollback plan, and explicit human approval from the accountable data/security owner.

## Verification
Use negative access tests, cross-tenant isolation tests, permission-revocation tests, cache-isolation tests, configuration inspection, and audit-log review.