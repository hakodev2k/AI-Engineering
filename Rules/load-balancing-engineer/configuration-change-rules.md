# Configuration Change Rules

## Purpose
Make load-balancer configuration changes reviewable, reproducible, and safe.

## Scope
Listeners, routes, pools, policies, certificates, timeouts, limits, and generated configuration.

## MUST
- Production configuration MUST be version-controlled or otherwise auditable with author, timestamp, and change intent.
- Changes MUST pass syntax/schema validation and relevant policy checks before deployment.
- Material changes MUST include impact analysis, validation plan, rollback plan, and monitoring criteria.
- Generated configuration MUST be reproducible from controlled inputs.
- Emergency changes MUST be reconciled into the authoritative configuration source after stabilization.

## MUST NOT
- MUST NOT make undocumented manual production edits as a normal operating practice.
- MUST NOT deploy configuration that has not passed available validation.
- MUST NOT combine unrelated high-risk routing changes when separation would improve rollback safety.

## SHOULD
- Use peer review and automated policy validation.
- Keep changes small enough to attribute resulting behavior.

## Exceptions
Incident-response changes may bypass normal lead time only under authorized incident procedure and must be documented afterward.

## Verification
Inspect diffs, approvals, validation results, deployment logs, runtime configuration, drift detection, and rollback evidence.