# Rollout and Migration Rules
## Purpose
Introduce developer-platform changes without uncontrolled disruption.
## Scope
Tool migrations, platform adoption, configuration transitions, feature flags, deprecations, and fleet-wide changes.
## MUST
- Material migrations MUST define target population, prerequisites, success metrics, failure signals, support path, and rollback.
- Rollouts MUST be staged when blast radius or uncertainty is material.
- Irreversible changes MUST require explicit human approval and recovery planning.
- Migration completion MUST be verified from evidence rather than announcement.
## MUST NOT
- MUST NOT force broad adoption before representative validation when staged rollout is feasible.
- MUST NOT remove the prior path before exit criteria are met unless security risk requires it and approval is obtained.
- MUST NOT conceal known migration failures from affected teams.
## SHOULD
- Automated migration SHOULD be idempotent and previewable.
- Rollouts SHOULD pause automatically or operationally on defined severe signals.
## Exceptions
Emergency rollouts require documented urgency, authority, blast-radius controls, communication, and post-change verification.
## Verification
Inspect rollout cohorts, telemetry, migration logs, rollback tests, support trends, adoption metrics, and approval records.