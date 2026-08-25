# Security Change Management
## Purpose
Make network-security changes controlled, reviewable, and recoverable.
## Scope
Policies, routes, ACLs, firmware, topology, identity integrations, and security appliances.
## MUST
- Changes MUST state intent, affected scope, validation, risk, and rollback.
- High-impact production changes MUST receive human approval before execution.
- Pre-change state MUST be recoverable for critical devices and policies.
- Post-change verification MUST confirm security and service behavior.
## MUST NOT
- Destructive or broad production changes MUST NOT be executed from ambiguous requirements.
- Emergency changes MUST NOT bypass retrospective documentation and review.
## SHOULD
- Changes SHOULD be staged, canaried, or otherwise bounded when architecture permits.
## Exceptions
Emergency execution requires incident authority, recorded rationale, and prompt retrospective review.
## Verification
Review change records, diffs, approvals, backups, validation evidence, telemetry, and rollback readiness.