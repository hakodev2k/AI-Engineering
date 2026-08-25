# Authorization Rules

## Purpose
Prevent unauthorized actions and cross-user, cross-tenant, or privilege-boundary access.

## Scope
Applies to APIs, UI-backed operations, background jobs, object access, administrative functions, service-to-service calls, and policy engines.

## MUST
- Every protected operation MUST authorize the authenticated principal against the requested action and target resource at an authoritative server-side boundary.
- Object-level authorization MUST be enforced before data is read, changed, exported, or acted upon.
- Tenant and environment boundaries MUST be explicit inputs to authorization decisions where applicable.
- Default behavior for missing, malformed, unavailable, or indeterminate policy decisions MUST be deny for protected actions.
- Privilege changes MUST be auditable and subject to controls proportional to their impact.
- Authorization rules MUST have negative tests covering horizontal and vertical privilege escalation.

## MUST NOT
- MUST NOT infer authorization from UI visibility, route knowledge, client claims that are not trusted, or possession of an object identifier.
- MUST NOT grant broad wildcard permissions when narrower permissions satisfy the requirement.
- MUST NOT reuse administrator credentials for ordinary application operations.

## SHOULD
- SHOULD centralize policy semantics while keeping enforcement close to protected resources.
- SHOULD design permissions around capabilities and business actions rather than implementation details.

## Exceptions
Exceptions require explicit scope, reason, residual risk, compensating controls, review date, and accountable approval. Temporary elevation MUST expire automatically where practical.

## Verification
Review policy definitions, enforcement points, IAM/configuration, privilege matrices, audit records, and tests for IDOR/BOLA, role escalation, tenant crossover, and policy failure modes.