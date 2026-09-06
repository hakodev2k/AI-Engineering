# Approval and Production Safety Rules

## Purpose
Define authority boundaries for high-risk AI routing changes and prevent autonomous execution beyond approved scope.

## Scope
Production deployment, breaking routes, provider onboarding, security controls, credentials, quotas, destructive configuration, and emergency overrides.

## MUST
- Analyze, recommend, prepare, and execute MUST be treated as distinct authority levels.
- Human approval MUST be obtained before production deployment of high-risk routing changes, weakening security controls, secret rotation, high-risk access changes, or breaking caller contracts.
- Irreversible or destructive production actions MUST include impact analysis, recovery strategy, and explicit approval.
- Large provider/model migrations MUST define compatibility, rollout, rollback, and verification evidence before execution.
- Approved execution MUST remain within the exact authorized scope.

## MUST NOT
- MUST NOT force push or rewrite repository history to bypass review.
- MUST NOT disable mandatory policy gates merely to unblock a deployment.
- MUST NOT silently exceed granted production authority.
- MUST NOT interpret absence of an objection as approval for a dangerous action.

## SHOULD
- Prefer reversible changes with progressive exposure and independent observability.
- Record approval context alongside high-risk changes.

## Exceptions
Emergency authority must be explicitly defined, time-bounded, auditable, and followed by post-event review.

## Verification
Inspect approvals, change records, deployment logs, access audit events, rollback plans, and post-change validation.