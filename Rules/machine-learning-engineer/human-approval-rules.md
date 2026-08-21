# Human Approval Rules
## Purpose
Keep high-risk actions within explicit authority boundaries.
## Scope
Production, destructive data operations, access, security controls, and consequential model changes.
## MUST
- Distinguish analysis, recommendation, preparation, and execution authority.
- Obtain authorized human approval before production deployment, destructive data changes, irreversible migrations, secret rotation, high-risk access changes, security weakening, or materially consequential model-policy changes unless explicit standing authority exists.
- Present expected impact, evidence, rollback, and residual risk for approval.
## MUST NOT
- Interpret technical capability as permission to execute.
- Bypass approval because a change is urgent without recognized incident authority.
## SHOULD
- Prefer reversible and staged actions for uncertain changes.
## Exceptions
Pre-authorized automation must have bounded scope, audited controls, and tested rollback.
## Verification
Inspect approval records, audit logs, change tickets, permissions, and rollback evidence.