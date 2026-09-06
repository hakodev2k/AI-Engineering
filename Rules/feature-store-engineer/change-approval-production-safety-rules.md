# Change Approval and Production Safety Rules

## Purpose
Control dangerous feature-store changes and keep AI agents within authorized operational boundaries.

## Scope
Production deployments, schema changes, destructive data operations, backfills, access changes, configuration, and contract changes.

## MUST
- Analysis, recommendation, preparation, and production execution MUST be treated as separate authority levels.
- Production deployment, destructive data deletion, irreversible migration, security weakening, secret rotation, and high-risk access changes MUST require explicit human approval.
- Breaking feature contracts MUST require consumer-impact review and migration approval.
- Production configuration changes MUST be auditable and reversible where practical.
- Large backfills or re-materializations MUST have capacity, rollback, and verification plans.

## MUST NOT
- MUST NOT force push or rewrite history to bypass review.
- MUST NOT execute destructive SQL or storage deletion without approved scope and recovery strategy.
- MUST NOT disable security or data-quality gates merely to unblock a release.
- MUST NOT silently exceed granted operational authority.

## SHOULD
- Prefer small, reversible, independently observable changes.
- Use progressive rollout for high-impact serving changes.

## Exceptions
Emergency execution requires incident authority, minimized blast radius, complete audit trail, and post-event review.

## Verification
Inspect approvals, deployment logs, diffs, rollback plans, access audit events, and post-change validation.