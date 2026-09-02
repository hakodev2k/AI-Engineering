# Production Change and Approval Rules

## Purpose
Control high-risk cloud changes so authority, blast radius, rollback, and evidence are explicit before production execution.

## Scope
Applies to deployments, infrastructure changes, routing, IAM, encryption keys, production configuration, destructive data actions, and security controls.

## MUST
- High-risk production changes MUST identify expected impact, blast radius, validation steps, rollback or recovery path, responsible operator, and approval authority.
- Human approval MUST be obtained before production deployment, infrastructure destruction, destructive data actions, secret rotation with broad impact, high-risk IAM changes, breaking public contracts, or weakening security controls.
- Emergency changes MUST remain auditable and receive retrospective review after stabilization.
- Change verification MUST use observable post-change evidence rather than successful command execution alone.
- An AI agent MUST distinguish analysis, recommendation, preparation, and execution and MUST NOT execute beyond granted authority.

## MUST NOT
- MUST NOT force push or rewrite shared production-related history as a routine remediation.
- MUST NOT bypass approval because a change appears small when its actual blast radius is uncertain.
- MUST NOT continue a rollout when defined stop conditions are met without authorized reassessment.

## SHOULD
- Prefer progressive, reversible releases and narrow blast radius.
- Automate deterministic preflight and post-change checks.

## Exceptions
Exceptions require explicit incident authority, reason, risk, audit trail, and retrospective verification.

## Verification
Review change tickets or approvals, infrastructure diffs, deployment logs, rollback evidence, audit logs, post-change metrics, and incident records.