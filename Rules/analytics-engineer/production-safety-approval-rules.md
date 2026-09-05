# Production Safety and Approval Rules

## Purpose
Define authority boundaries for high-risk analytical actions that can affect production data, contracts, access, or trusted business reporting.

## Scope
Applies to production deployments, destructive operations, historical rewrites, access changes, breaking contracts, and irreversible migrations.

## MUST
- Human approval MUST be obtained before destructive production SQL, irreversible historical rewrites, breaking public data-contract changes, or high-risk access expansion.
- Production deployment execution MUST be distinguishable from analysis, recommendation, and preparation.
- High-risk changes MUST define rollback, recovery, or compensating actions before execution.
- The expected blast radius and affected consumers MUST be reviewed before destructive or breaking actions.
- Production configuration, secret rotation, and permission changes MUST follow the target environment's approval policy.

## MUST NOT
- MUST NOT silently exceed granted execution authority.
- MUST NOT delete production data, truncate trusted datasets, or destroy infrastructure merely to resolve pipeline errors.
- MUST NOT weaken privacy or security controls to unblock analytical work without explicit approval.
- MUST NOT force push or rewrite shared Git history as part of normal remediation.

## SHOULD
- Prefer reversible, staged, and independently verifiable changes.
- Use dry runs, previews, row-count estimates, or isolated rehearsals before destructive operations where supported.

## Exceptions
Emergency actions require authorized incident authority, minimized scope, preserved audit evidence, and post-event review.

## Verification
Inspect approvals, change tickets, SQL previews, deployment logs, permission diffs, rollback plans, and audit records.