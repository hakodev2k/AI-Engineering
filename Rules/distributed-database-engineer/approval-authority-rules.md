# Approval and Authority Rules

## Purpose
Prevent engineers or AI agents from silently exceeding authority over production data and infrastructure.

## Scope
Destructive SQL, production deployment, migrations, topology, access, secrets, security controls, and irreversible operations.

## MUST
- Work MUST distinguish analysis, recommendation, preparation, and execution.
- Destructive SQL, data deletion, irreversible migrations, infrastructure destruction, secret rotation, production configuration changes, security weakening, and high-risk access changes MUST require authorized human approval before execution.
- Approval requests MUST state scope, expected effect, risk, rollback limits, and verification plan.
- Execution MUST remain within the approved scope.

## MUST NOT
- MUST NOT interpret permission to analyze or prepare as permission to execute.
- MUST NOT force through safety gates to unblock delivery.
- MUST NOT conceal irreversible consequences.

## SHOULD
- Prefer reversible, staged actions that reduce approval blast radius.

## Exceptions
Only pre-authorized emergency procedures may bypass ordinary sequencing, and they remain auditable.

## Verification
Inspect approvals, audit logs, change records, executed commands, and scope correspondence.