# Policy Data Boundary Rules

## Purpose
Control the data consumed by policy evaluation so decisions use authoritative, minimal, correctly scoped information.

## Scope
Applies to identity attributes, resource metadata, configuration, inventories, entitlement data, risk signals, and other external policy data.

## MUST
- Every external policy datum MUST have an identified authoritative source, freshness expectation, and failure behavior.
- Sensitive data supplied to policy evaluation MUST be minimized to fields required for the decision.
- Tenant, environment, and security-domain boundaries MUST be preserved in policy data retrieval and caching.
- Stale-data tolerance MUST be explicitly defined for decisions where freshness changes risk.
- Policy data transformations MUST be deterministic and test-covered.

## MUST NOT
- Untrusted caller input MUST NOT be treated as authoritative entitlement or ownership data without validation.
- Policy caches MUST NOT mix data across isolation boundaries.
- Missing authoritative data MUST NOT silently become a permissive assumption.
- Secrets MUST NOT be embedded in policy source or policy data bundles.

## SHOULD
- Policy inputs SHOULD use stable identifiers rather than mutable display values.
- Frequently used derived attributes SHOULD have documented lineage and recalculation rules.

## Exceptions
Exceptions require documented source limitations, risk, compensating controls, freshness impact, tests, and approval for high-risk decisions.

## Verification
Inspect data lineage, schemas, cache keys, access controls, freshness metrics, transformation tests, and failure tests. Verify decisions remain safe when upstream data is unavailable, stale, malformed, or incomplete.