# Production Change Safety Rules

## Purpose
Control high-risk memory operations and keep AI agents within explicitly authorized production boundaries.

## Scope
Deployments, destructive changes, policy updates, reindexing, access changes, secret rotation, and emergency actions.

## MUST
- Analysis, recommendation, preparation, and execution MUST be treated as separate authority levels.
- Production deployment, destructive deletion, irreversible migration, secret rotation, security weakening, and high-risk access changes MUST require explicit human approval.
- Changes affecting retrieval semantics MUST include measured evaluation and rollback criteria.
- Production configuration changes MUST be auditable and reversible where practical.
- Large purges, backfills, re-embedding jobs, and index rebuilds MUST define blast radius, capacity controls, and post-change verification.

## MUST NOT
- MUST NOT silently exceed granted operational authority.
- MUST NOT disable privacy, authorization, or safety controls merely to unblock a release.
- MUST NOT force push or rewrite repository history to bypass review.
- MUST NOT execute destructive storage operations without approved scope and recovery strategy.

## SHOULD
- Prefer small, reversible, independently observable changes.
- Use progressive rollout for retrieval and memory-policy changes.

## Exceptions
Emergency execution requires incident authority, minimized blast radius, complete audit trail, and post-event review.

## Verification
Inspect approvals, deployment logs, diffs, rollback plans, audit events, and post-change validation.