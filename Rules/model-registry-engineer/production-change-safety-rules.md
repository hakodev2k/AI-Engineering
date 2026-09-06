# Production Change Safety Rules

## Purpose
Control high-impact registry changes and ensure automated agents do not exceed authorized production authority.

## Scope
Production deployments, alias changes, destructive deletion, schema migration, infrastructure configuration, access changes, secret rotation, and policy changes.

## MUST
- Analysis, recommendation, preparation, and production execution MUST be treated as distinct authority levels.
- Production deployment, destructive model deletion, irreversible migration, secret rotation, security-control weakening, and high-impact access changes MUST require explicit human approval.
- Production changes MUST identify scope, expected impact, verification steps, and rollback or recovery strategy where practical.
- Changes to production aliases or promotion policy MUST be auditable.
- Large migrations MUST be staged or otherwise bounded to reduce blast radius.

## MUST NOT
- MUST NOT force push or rewrite history to bypass required review.
- MUST NOT delete production artifacts or metadata without validated dependency and recovery checks.
- MUST NOT disable security, compatibility, or promotion controls merely to unblock delivery.
- An AI agent MUST NOT silently exceed granted production permissions.

## SHOULD
- Prefer small, reversible, independently observable changes.
- Use progressive rollout for registry changes that affect many consumers.

## Exceptions
Emergency execution requires authorized incident context, minimal necessary scope, complete audit trail, and post-event review.

## Verification
Inspect approvals, Git diffs, deployment records, alias history, migration plans, access logs, and post-change validation evidence.