# Approval and Authority Rules

## Purpose
Define decision boundaries for telemetry changes that can affect production systems, security, privacy, cost, or compliance.

## Scope
Production deployments, destructive retention changes, access changes, sensitive-data capture, security-control changes, large migrations, and high-risk configuration changes.

## MUST
- Analysis, recommendation, preparation, and execution MUST be treated as distinct authority levels.
- Human approval MUST precede production changes that materially alter data access, retention, privacy exposure, security controls, destructive lifecycle behavior, or public operational contracts.
- Approval requests MUST include intended change, evidence, risk, rollback or recovery, and verification plan.
- Executed high-risk changes MUST be attributable to an authorized actor or approved automation.

## MUST NOT
- MUST NOT infer execution permission from permission to analyze or prepare a change.
- MUST NOT weaken security or privacy controls merely to restore telemetry flow without explicit approval.
- MUST NOT perform irreversible deletion or destructive reconfiguration silently.

## SHOULD
- Prefer reversible, staged changes with bounded blast radius.

## Exceptions
Emergency authority may follow the governing incident process, with required post-event review and evidence preservation.

## Verification
Inspect approvals, change records, audit logs, deployment history, and rollback or recovery evidence.