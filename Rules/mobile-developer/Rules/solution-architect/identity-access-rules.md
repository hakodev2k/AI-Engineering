# Identity and Access Rules

## Purpose
Ensure authentication and authorization architecture is explicit, least-privileged, and auditable.

## Scope
Covers users, services, workloads, administrators, tokens, secrets, roles, policies, and delegated access.

## MUST
- Human and workload identities MUST be distinguishable and independently controllable.
- Authorization MUST be enforced at the authoritative resource boundary.
- Privileged access MUST be minimized, reviewed, and auditable.
- Service-to-service authentication MUST use supported identity mechanisms rather than shared static credentials where practical.
- Token scopes, audience, issuer, lifetime, and revocation assumptions MUST be explicit.

## MUST NOT
- MUST NOT rely on client-side authorization for protection of backend resources.
- MUST NOT use broad administrator permissions when narrower permissions are sufficient.
- MUST NOT share credentials across unrelated workloads.

## SHOULD
- Prefer short-lived credentials and managed/workload identity.
- Separate operational administration from normal application identities.

## Exceptions
Legacy credentials require compensating controls, rotation, monitoring, and migration plan.

## Verification
Inspect identity flows, role/policy definitions, token validation, permissions, audit logs, secret inventories, and access reviews.