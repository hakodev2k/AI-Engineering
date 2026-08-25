# Production Safety Rules

## Purpose
Prevent unsafe execution of high-impact changes and preserve operator control.

## Scope
Production deployments, data changes, configuration, migrations, access, and irreversible operations.

## MUST
- High-impact actions MUST distinguish analysis, recommendation, preparation, and execution authority.
- Production deployment, destructive data operations, irreversible migrations, security-control weakening, secret rotation, and high-risk access changes MUST require authorized human approval unless an explicit pre-approved procedure grants execution authority.
- Risky changes MUST define blast radius, verification, and rollback or recovery.
- Production conclusions MUST use available operational evidence.

## MUST NOT
- MUST NOT force push or rewrite shared history without explicit approval.
- MUST NOT execute destructive commands merely because they were generated or tested elsewhere.
- MUST NOT conceal uncertainty about production state.

## SHOULD
- Prefer reversible, incremental, observable changes.
- Use canary or staged rollout when blast radius justifies it.

## Exceptions
Automated remediation may execute only within explicitly pre-authorized scope, limits, and audit controls.

## Verification
Approval records, deployment/config diffs, runbooks, audit logs, rollback evidence, metrics, logs, and traces.