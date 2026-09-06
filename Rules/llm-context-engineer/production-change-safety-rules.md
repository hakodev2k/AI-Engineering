# Production Change Safety Rules

## Purpose
Control high-impact context changes and keep execution authority explicit.

## Scope
Production deployments, context policy changes, source enablement, access changes, large migrations, and rollback.

## MUST
- Analysis, recommendation, preparation, and production execution MUST be treated as distinct authority levels.
- Production changes that expand data scope, alter authorization boundaries, or materially change context semantics MUST require explicit human approval.
- High-impact changes MUST have rollback or forward-recovery plans before execution.
- Changes MUST define expected impact and post-deployment verification.
- Rollouts MUST preserve enough observability to detect context-quality regressions.

## MUST NOT
- MUST NOT bypass review by changing hidden runtime configuration.
- MUST NOT weaken required access or privacy controls merely to unblock deployment.
- MUST NOT execute irreversible context migrations without approved recovery strategy.
- MUST NOT claim a deployment is safe without validation evidence.

## SHOULD
- Prefer progressive rollout and reversible configuration changes.
- Separate risky source changes from unrelated releases.

## Exceptions
Emergency changes require incident authority, bounded scope, audit trail, and retrospective review.

## Verification
Inspect approvals, diffs, deployment records, rollback plans, context evaluations, and post-release telemetry.