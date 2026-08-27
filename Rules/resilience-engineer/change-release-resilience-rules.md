# Change and Release Resilience Rules

## Purpose
Prevent routine change from becoming an avoidable availability or recovery incident.

## Scope
Applies to application releases, infrastructure changes, configuration, schemas, dependencies, routing, and resilience controls.

## MUST
- High-impact changes MUST have a rollback, roll-forward, or containment strategy before execution.
- Releases MUST use staged exposure when practical for changes with uncertain production behavior.
- Compatibility across mixed versions MUST be validated when rollout is not atomic.
- Changes to failover, retry, timeout, capacity, health, or recovery controls MUST receive explicit resilience review.
- Production deployment and high-risk configuration changes MUST require human authorization according to project governance.

## MUST NOT
- MUST NOT combine unrelated high-risk changes when doing so prevents fault isolation or safe rollback.
- MUST NOT remove the previous recovery path before the new path is validated.
- MUST NOT treat successful deployment tooling as proof of healthy service behavior.

## SHOULD
- Releases SHOULD monitor user SLIs and resilience-control activation during rollout.
- Riskier changes SHOULD be scheduled when qualified responders and rollback capability are available.

## Exceptions
Emergency changes may compress normal process under incident authority but MUST retain impact assessment, explicit authorization, verification, and retrospective documentation.

## Verification
Review change records, deployment configuration, compatibility tests, rollout telemetry, approvals, and rollback evidence. Confirm service health rather than deployment status alone.