# Approval and Authority Rules

## Purpose
Define explicit human authority boundaries for model-risk decisions and dangerous actions.

## Scope
Applies to approvals involving production release, risk acceptance, destructive changes, security controls, data, access, contracts, and other high-impact actions.

## MUST
- Roles and approval authority MUST be defined for model release, material risk acceptance, emergency containment, and control exceptions.
- Human approval MUST be obtained before production deployment of high-risk models, irreversible or destructive data actions, secret rotation, high-risk access changes, weakening security controls, breaking public contracts, or equivalent material actions.
- AI agents MAY analyze, recommend, and prepare such actions but MUST NOT execute them without explicit authority when approval is required.
- Approval records MUST identify the action, evidence reviewed, scope, residual risk, approver, and time.
- Emergency authority MUST be bounded by incident procedures and followed by retrospective review.

## MUST NOT
- Approval MUST NOT be inferred from prior approval of a materially different model, version, environment, or risk profile.
- An AI agent MUST NOT silently expand its own permissions or bypass required human review.
- Schedule pressure MUST NOT be used as implicit risk acceptance.

## SHOULD
- High-risk decisions SHOULD use separation of duties where practical.
- Actions SHOULD be designed to be reversible and progressively scoped before broad execution.

## Exceptions
Only explicitly authorized emergency procedures may relax normal approval sequencing. The reason, action, approver, duration, residual risk, and follow-up verification must be recorded.

## Verification
Inspect role permissions, approval workflows, audit logs, deployment controls, access-change records, incident procedures, and sampled high-risk changes for explicit authorization.