# Production Change Approval Rules

## Purpose
Control high-risk tracing changes that can affect application reliability, telemetry cost, security, or incident visibility.

## Scope
Applies to production instrumentation, sampling, collector topology, exporters, retention, access policy, schema changes, and emergency diagnostics.

## MUST
- Material production tracing changes MUST have a documented impact assessment covering application overhead, telemetry volume, cost, security, and rollback.
- High-risk changes MUST be reviewed by accountable service or platform owners before execution.
- Emergency increases in capture detail MUST be time-bounded and have explicit rollback criteria.
- Changes that weaken security controls, expose sensitive data, or materially increase production load MUST require explicit human approval.

## MUST NOT
- MUST NOT silently enable unrestricted payload capture, 100% high-volume tracing, new external exporters, or broad administrative access.
- MUST NOT bypass normal deployment controls merely because a change affects telemetry rather than business logic.
- MUST NOT claim a rollout is safe without post-change evidence.

## SHOULD
- Prefer staged rollout, canarying, feature flags, and reversible configuration for high-impact changes.
- Define acceptance and rollback thresholds before deployment.

## Exceptions
Exceptions require incident urgency, accountable approver, bounded scope, compensating controls, and retrospective review.

## Verification
Inspect change records, approvals, configuration diffs, rollout telemetry, cost and drop metrics, security checks, and rollback readiness.
