# Deployment and Release

## Purpose
Control production change risk across ML platform and model delivery paths.

## Scope
Platform releases, model deployments, configuration, rollout, rollback, and approvals.

## MUST
- Production changes MUST identify blast radius, validation, monitoring, rollback, and accountable approver when required.
- Breaking platform contracts MUST use a migration or versioning strategy.
- High-risk releases MUST use progressive exposure when technically feasible.
- Production deployment execution MUST require human approval unless explicitly delegated by governed policy.

## MUST NOT
- Security controls or release gates MUST NOT be disabled merely to unblock deployment.
- Irreversible changes MUST NOT execute without approved recovery or mitigation strategy.

## SHOULD
- Platform and model changes SHOULD be independently deployable where coupling is unnecessary.

## Exceptions
Emergency changes require explicit incident context, approval, audit trail, and retrospective verification.

## Verification
Inspect diffs, CI gates, approvals, rollout telemetry, compatibility tests, deployment logs, and rollback exercises.