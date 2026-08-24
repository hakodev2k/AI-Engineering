# Privileged Database Operations Rules

## Purpose
Constrain high-impact administrative actions and preserve human authority over dangerous production changes.

## Scope
Covers superuser activity, privilege administration, destructive DDL/DML, security-control changes, key operations, and emergency access.

## MUST
- Privileged actions MUST use attributable identities and the minimum privilege necessary for the task.
- High-impact production actions MUST have explicit authorization, defined scope, verification, and recovery or rollback considerations.
- Emergency privilege elevation MUST be time-bounded and reviewed after use.
- Administrative activity MUST generate protected audit evidence.
- Automation and AI agents MUST distinguish analysis, recommendation, preparation, and execution and MUST remain within granted authority.

## MUST NOT
- Routine application workloads MUST NOT execute with superuser-equivalent privilege.
- Destructive production data operations, irreversible migrations, security-control weakening, key destruction, or high-risk access changes MUST NOT be executed without explicit human approval.
- Privileged sessions MUST NOT be shared between operators.

## SHOULD
- Use just-in-time elevation, dual control, or peer approval for the highest-risk operations.
- Maintain tested break-glass procedures.

## Exceptions
Emergency deviations require authorized incident ownership, recorded rationale, bounded scope, monitoring, and retrospective review.

## Verification
Inspect privileged-role membership, elevation records, session/audit logs, approvals, automation permissions, and sampled high-risk changes. Test that ordinary identities cannot perform privileged operations.