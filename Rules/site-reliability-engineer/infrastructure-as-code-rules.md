# Infrastructure as Code Rules

## Purpose
Keep infrastructure changes reproducible, reviewable, and safe across environments.

## Scope
Applies to infrastructure definitions, modules, state, plans, and automated provisioning.

## MUST
- Persistent production infrastructure MUST be defined in code or an equivalently auditable declarative system unless explicitly exempted.
- Infrastructure changes MUST be reviewed using a plan, diff, or equivalent preview before execution.
- State storage MUST be protected against unauthorized access and accidental loss.
- Reusable modules MUST define ownership, versioning, and compatibility expectations.
- Destructive changes MUST require explicit human approval.

## MUST NOT
- MUST NOT manually mutate managed infrastructure and leave authoritative code unreconciled.
- MUST NOT expose secrets through plans, outputs, logs, or source-controlled variables.
- MUST NOT apply broad privileged changes without understanding affected resources.

## SHOULD
- Prefer immutable or replaceable infrastructure patterns where operationally appropriate.
- Validate infrastructure code in CI before production application.

## Exceptions
Emergency manual intervention requires recorded evidence, bounded scope, and prompt reconciliation into the authoritative definition.

## Verification
Review IaC diffs, state protection, CI validation, drift detection, approvals, and cloud audit logs.