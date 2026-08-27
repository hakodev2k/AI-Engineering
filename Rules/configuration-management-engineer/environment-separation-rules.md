# Environment Separation

## Purpose
Prevent configuration intended for one environment, tenant, region, or trust boundary from affecting another.

## Scope
Development, test, staging, production, regional, tenant-specific, and regulated environments.

## MUST
- Environment identity MUST be explicit and unambiguous at configuration resolution time.
- Production configuration MUST be isolated from non-production write paths and credentials.
- Promotion between environments MUST preserve an auditable record of intentional differences.
- Environment-specific overrides MUST be minimal, documented, and validated.
- Tests MUST detect accidental use of production endpoints or resources from non-production contexts where feasible.

## MUST NOT
- Non-production automation MUST NOT have implicit authority to modify production configuration.
- Production secrets or sensitive values MUST NOT be copied into lower environments for convenience.
- Environment selection MUST NOT depend on fragile heuristics such as hostname substring matching when a stronger identity is available.

## SHOULD
- Promote the same configuration artifact with controlled environment overlays rather than rebuild unrelated copies.
- Make dangerous environments visually and operationally distinct.

## Exceptions
Cross-environment operations require a documented purpose, least-privilege access, safeguards, verification, and approval appropriate to the risk.

## Verification
Inspect access controls, environment selectors, overlays, deployment records, endpoint tests, and credential scopes. Exercise negative tests proving lower environments cannot mutate production state.