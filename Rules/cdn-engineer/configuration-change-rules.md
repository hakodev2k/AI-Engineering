# Configuration Change Rules

## Purpose
Prevent high-blast-radius CDN configuration errors and preserve reversibility.

## Scope
Applies to behaviors, routes, origins, headers, caching, security, TLS, and provider configuration.

## MUST
- Production changes MUST be reviewable as versioned configuration or an equivalent auditable diff.
- High-impact changes MUST define blast radius, validation signals, rollback trigger, and rollback method.
- Configuration MUST be validated syntactically and semantically before production application.
- Changes SHOULD be staged by environment, hostname, path, region, or traffic percentage when feasible.
- Human approval MUST precede production changes that can break public contracts, weaken security, expose data, or cause broad outage.

## MUST NOT
- MUST NOT make undocumented console-only production changes as routine practice.
- MUST NOT combine unrelated high-risk changes when separation improves diagnosis or rollback.
- MUST NOT remove rollback capability before replacement behavior is proven.

## SHOULD
- Use infrastructure/configuration as code.
- Keep change sets small and independently reversible.
- Capture effective provider configuration after deployment.

## Exceptions
Emergency incident changes may use expedited procedures under authorized incident command; resulting state MUST be reconciled into the managed configuration afterward.

## Verification
Review diffs, approvals, validation output, deployment logs, effective configuration, staged metrics, and rollback tests.