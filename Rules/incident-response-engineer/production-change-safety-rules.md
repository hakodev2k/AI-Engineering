# Production Change Safety Rules

## Purpose
Control risk when responders change live systems during an incident.

## Scope
Configuration, deployments, feature flags, infrastructure, data operations, access changes, traffic controls, and dependency changes.

## MUST
- Define intended effect, blast radius, prerequisites, verification, and rollback before a material production change when time permits.
- Require human approval for destructive data operations, irreversible migrations, security weakening, secret rotation, infrastructure destruction, breaking public contracts, and other project-defined high-risk actions.
- Use least-privilege access and auditable execution paths.
- Verify actual system state after every material change.

## MUST NOT
- Force push, rewrite history, bypass required controls, or silently exceed granted authority to accelerate response.
- Execute copied commands without validating environment, target, parameters, and consequences.

## SHOULD
- Prefer incremental, reversible, narrowly scoped changes with automated safeguards.

## Exceptions
Emergency authority may be used only where explicitly defined by organizational policy; action, approver or authority basis, evidence, and follow-up review MUST be recorded.

## Verification
Inspect audit logs, change records, approvals, command history, deployment records, and post-change telemetry.