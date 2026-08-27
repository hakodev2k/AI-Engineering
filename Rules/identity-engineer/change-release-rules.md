# Change and Release Safety
## Purpose
Prevent identity changes from causing lockouts, privilege expansion, or trust failure.
## Scope
Policy, federation, directory, credential, connector, and identity-platform changes.
## MUST
- High-impact changes MUST have impact analysis, validation evidence, rollback or recovery procedure, and named approval before production execution.
- Breaking claim, protocol, or entitlement changes MUST identify affected consumers.
- Changes MUST be staged or otherwise bounded where feasible.
## MUST NOT
- Production identity policy MUST NOT be changed ad hoc without traceable authorization.
- Security controls MUST NOT be disabled solely to unblock a release.
## SHOULD
- Use canaries, compatibility periods, and automated policy tests.
## Exceptions
Emergency changes require incident linkage, authorized execution, monitoring, and retrospective review.
## Verification
Inspect diffs, approvals, test evidence, rollout telemetry, and rollback readiness.