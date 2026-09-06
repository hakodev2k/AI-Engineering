# Production Change Safety Rules

## Purpose
Control high-risk retrieval changes and keep execution within authorized boundaries.

## Scope
Production deployments, index replacement, data deletion, access changes, provider migration, configuration, and rollback.

## MUST
- Analysis, recommendation, preparation, and production execution MUST be treated as separate authority levels.
- Production deployment, destructive data deletion, irreversible index migration, security weakening, secret rotation, and high-risk access changes MUST require explicit human approval.
- High-impact changes MUST define rollback, validation, and blast-radius controls before execution.
- Breaking retrieval contracts or source semantics MUST include consumer-impact analysis.
- Production changes MUST be auditable and use current repository and environment state.

## MUST NOT
- MUST NOT force push or rewrite history to bypass review.
- MUST NOT delete source-derived indexes without recovery or deterministic rebuild evidence.
- MUST NOT disable security, quality, or authorization gates merely to unblock release.
- MUST NOT silently exceed granted operational authority.

## SHOULD
- Prefer progressive rollout, shadow evaluation, and reversible cutovers.
- Keep changes small enough to diagnose independently.

## Exceptions
Emergency execution requires incident authority, minimized blast radius, audit trail, and post-event review.

## Verification
Inspect approvals, deployment logs, diffs, rollback plans, cutover evidence, and post-change metrics.