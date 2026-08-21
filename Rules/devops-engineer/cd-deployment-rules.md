# CD and Deployment Rules

## Purpose
Protect production reliability during automated and operator-driven deployments.

## Scope
Applies to application, infrastructure, configuration, and platform releases.

## MUST
- Every production deployment MUST have a verifiable rollback or forward-fix strategy.
- Deployment automation MUST stop on failed health or validation gates.
- Production changes MUST be traceable to an approved source revision and deployment record.
- High-impact rollouts MUST define blast radius, verification signals, and recovery actions before execution.
- Environment-specific configuration MUST be validated before activation.

## MUST NOT
- MUST NOT deploy unreviewed artifacts directly from developer workstations.
- MUST NOT continue rollout after critical health checks fail.
- MUST NOT overwrite production state without a recovery plan.

## SHOULD
- Prefer progressive delivery, canary, blue-green, or staged rollout when risk justifies it.
- Prefer immutable artifacts promoted across environments.

## Exceptions
Emergency deployment requires explicit approval, documented urgency, verification plan, and mandatory post-change review.

## Verification
Inspect deployment history, artifact digests, approval records, health checks, rollback evidence, and post-deployment telemetry.