# Production Change and Approval Rules

## Purpose
Prevent unauthorized or irreversible identity-control changes from creating lockout, privilege escalation, or trust failure in production.

## Scope
Applies to production identity-provider policy, federation, privileged roles, authentication methods, conditional access, directories, key rotation, provisioning, and access-control configuration.

## MUST
- Production identity changes with material security or availability impact MUST have documented impact, rollback, verification, and accountable approval before execution.
- Changes that can weaken authentication, authorization, tenant isolation, privileged access, or auditability MUST require explicit human approval.
- Destructive identity operations, mass revocation, broad entitlement changes, and irreversible trust changes MUST be reviewed before execution.
- The executor MUST distinguish analysis, recommendation, preparation, and production execution and MUST NOT exceed granted authority.
- Post-change verification MUST confirm intended access, denied access, telemetry, and recovery path.

## MUST NOT
- Security controls MUST NOT be disabled in production merely to unblock deployment or troubleshooting.
- Forceful or irreversible identity changes MUST NOT be executed without an approved recovery strategy.
- A successful configuration write MUST NOT be treated as proof that the intended security outcome was achieved.

## SHOULD
- Use staged rollout, canary scope, simulation, or policy report-only modes where supported.
- High-risk changes SHOULD have a second qualified reviewer.

## Exceptions
Emergency exceptions require documented incident context, authorized decision maker, bounded scope, compensating controls, and retrospective review.

## Verification
Inspect change records, approvals, configuration diffs, rollout evidence, rollback plans, access tests, audit logs, and post-change validation results.