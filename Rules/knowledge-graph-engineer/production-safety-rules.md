# Production Safety Rules

## Purpose
Control high-risk graph changes and keep execution authority explicit.

## Scope
Production deployments, destructive mutations, bulk deletes, access changes, migrations, configuration, and emergency operations.

## MUST
- Analysis, recommendation, preparation, and production execution MUST be treated as separate authority levels.
- Production deployment, destructive graph deletion, irreversible migration, secret rotation, security weakening, and high-risk access changes MUST require explicit human approval.
- Large bulk mutations MUST define scope, expected cardinality, rollback or recovery strategy, and post-change verification.
- Production configuration changes MUST be auditable and reversible where practical.

## MUST NOT
- MUST NOT execute destructive graph operations without approved scope and recovery strategy.
- MUST NOT disable security or validation controls merely to unblock a release.
- MUST NOT force push or rewrite history to bypass review.
- MUST NOT silently exceed granted operational authority.

## SHOULD
- Prefer small, reversible, independently observable changes.
- Use progressive rollout for high-impact query or storage changes.

## Exceptions
Emergency execution requires incident authority, minimized blast radius, complete audit trail, and post-event review.

## Verification
Inspect approvals, deployment logs, diffs, rollback plans, access audit events, and post-change reconciliation.