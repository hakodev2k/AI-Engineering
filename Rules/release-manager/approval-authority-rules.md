# Approval Authority Rules

## Purpose
Define explicit authority boundaries so release coordination never becomes unauthorized production, security, data, or source-control execution.

## Scope
Applies to human operators, automation, and AI agents participating in release planning and execution.

## MUST
- Release workflows MUST distinguish analyze, recommend, prepare, approve, and execute as separate authority levels.
- Required approvers MUST be identified by change risk and organizational policy before execution.
- Human approval MUST be obtained before production deployment, destructive SQL, data deletion, irreversible migration, force push or history rewriting, infrastructure destruction, secret rotation, production configuration changes, breaking public contracts, weakening security controls, large dependency migrations, or high-risk access changes when those actions are in scope.
- Approval records MUST identify the action, target, candidate/version, risk, approver, and time.
- Automation MUST fail closed when required authorization is absent or unverifiable.

## MUST NOT
- An AI agent MUST NOT infer approval from intent, prior approvals, urgency, or possession of credentials.
- Approval for one action MUST NOT be reused for materially different scope or targets.
- A Release Manager MUST NOT pressure an approver to accept risk by obscuring failed gates or alternatives.

## SHOULD
- Approval mechanisms SHOULD use least privilege, separation of duties, and time-bounded access where practical.
- Reusable policies SHOULD define escalation paths when the normal approver is unavailable.

## Exceptions
Emergency authority must be pre-defined or explicitly invoked by an authorized human, with scope, reason, risk, duration, and retrospective review recorded.

## Verification
Inspect policy mappings, approval records, access controls, audit logs, workflow gates, and the exact actions executed. Confirm authorization preceded execution.