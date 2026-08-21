# Self-Service Rules

## Purpose
Make common platform operations safe for teams to perform without manual platform intervention.

## Scope
Applies to service creation, environment provisioning, access requests, deployments, databases, queues, secrets, and routine platform workflows.

## MUST
- Self-service actions MUST enforce policy before execution.
- Destructive or privileged actions MUST require explicit confirmation or approval proportional to risk.
- Workflows MUST produce deterministic status and actionable failure information.
- Quotas and ownership MUST be enforced for provisioned resources.

## MUST NOT
- MUST NOT require hidden tribal knowledge for normal workflows.
- MUST NOT bypass security controls to improve convenience.
- MUST NOT expose credentials to users when delegated identity can be used.

## SHOULD
- Prefer paved paths with safe defaults and escape hatches.
- Prefer asynchronous operations for long-running provisioning.

## Exceptions
Manual intervention is acceptable for exceptional high-risk cases when reason, owner, and follow-up automation opportunity are recorded.

## Verification
Review workflow tests, policy checks, permission boundaries, failure paths, user documentation, and audit events.