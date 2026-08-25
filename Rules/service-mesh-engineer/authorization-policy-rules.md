# Authorization Policy
## Purpose
Enforce least-privilege service-to-service access.
## Scope
Mesh authorization, principals, namespaces, methods, paths, and policy inheritance.
## MUST
- Authorization MUST be based on authenticated identities and explicit intended access.
- High-impact policy changes MUST identify newly allowed and newly denied flows.
- Default-deny adoption MUST be staged with verified dependency inventories.
## MUST NOT
- MUST NOT use broad wildcards when narrower identities or operations are known.
- MUST NOT weaken authorization to hide unresolved dependency failures.
- MUST NOT assume network location alone proves workload identity.
## SHOULD
- Policies SHOULD be generated or validated against declared service dependencies.
## Exceptions
Temporary broad access requires documented scope, owner, expiry, risk, and security approval.
## Verification
Run positive and negative authorization tests, inspect effective policies, audit logs, and dependency maps.