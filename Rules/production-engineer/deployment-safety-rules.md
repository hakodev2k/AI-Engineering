# Deployment Safety Rules

## Purpose
Control production deployment risk and preserve service continuity.

## Scope
Applies to application, infrastructure, configuration, database, and dependency deployments.

## MUST
- Deployments MUST use a defined, repeatable, and reviewable delivery path.
- High-risk deployments MUST define blast radius, health gates, rollback criteria, and responsible approver before execution.
- Production health MUST be checked during and after rollout using service-level evidence.
- Progressive delivery MUST stop automatically or manually when predefined failure thresholds are crossed.

## MUST NOT
- MUST NOT bypass required CI/CD controls merely to save time.
- MUST NOT deploy unreviewed production changes through ad hoc shell commands when an approved deployment mechanism exists.
- MUST NOT continue rollout while critical health signals are degrading without explicit incident-level authorization.

## SHOULD
- Prefer canary, phased, blue-green, or otherwise bounded rollout strategies for material changes.
- Separate deployment from feature exposure when feature controls make rollback safer.

## Exceptions
Emergency exceptions require explicit authorization, recorded rationale, minimized scope, immediate verification, and follow-up review.

## Verification
Inspect pipeline history, approvals, deployment manifests, health-gate results, rollout telemetry, and post-deployment checks.
