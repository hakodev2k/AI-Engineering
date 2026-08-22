# Deployment and Release Rules

## Purpose
Reduce release risk through compatibility, reversibility, progressive exposure, and evidence-based verification.

## Scope
Applies to application, infrastructure, schema, configuration, and integration releases.

## MUST
- Production changes MUST define verification and rollback or forward-fix strategy.
- Deployments that span multiple components MUST define compatible rollout order.
- Database and contract changes MUST tolerate expected version skew during deployment.
- High-impact releases MUST define smoke tests and post-release monitoring.
- Feature flags used for risk control MUST have ownership, safe defaults, and removal criteria.

## MUST NOT
- MUST NOT deploy a breaking contract change without coordinated migration.
- MUST NOT treat successful CI as sufficient evidence for production-specific risks.
- MUST NOT hide release failure by disabling alerts, health checks, or security controls.

## SHOULD
- Prefer small reversible releases and progressive rollout.
- Separate deployment from feature activation when it improves safety.

## Exceptions
Emergency releases may shorten normal gates only with explicit approval and follow-up review.

## Verification
Inspect pipeline gates, compatibility tests, smoke tests, deployment telemetry, rollback procedures, feature-flag state, and release records.