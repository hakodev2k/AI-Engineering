# Release and Production Safety Rules

## Purpose
Control production ranking changes so failures are bounded, reversible, and explicitly approved at appropriate risk levels.

## Scope
Applies to ranking models, retrieval configuration, index cutovers, query rewrites, filters, feature changes, and production rollout.

## MUST
- Every production relevance change MUST define validation evidence, rollout scope, monitoring, stop conditions, and rollback strategy.
- High-risk changes MUST use staged rollout or equivalent bounded exposure when practical.
- Production deployments, breaking contract changes, irreversible index migrations, and security-control changes MUST require explicit human approval when policy requires it.
- Rollback MUST restore a known-good compatible index, model, and configuration combination.
- Post-release verification MUST check relevance and operational guardrails.

## MUST NOT
- MUST NOT continue a rollout after critical stop conditions are met merely to gather more data.
- MUST NOT force push or rewrite history to conceal production change records.
- MUST NOT perform destructive production actions or weaken access controls without required approval.

## SHOULD
- Prefer small, independently observable, reversible changes.

## Exceptions
Emergency changes require incident authority, minimized scope, audit trail, rollback readiness, and post-event review.

## Verification
Inspect release records, approvals, rollout configuration, dashboards, stop conditions, rollback tests, and audit history.