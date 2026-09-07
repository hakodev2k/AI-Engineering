# Approval and Authority Rules

## Purpose
Prevent storage operators and AI agents from silently exceeding authorized decision boundaries.

## Scope
Applies to analysis, recommendation, preparation, and execution of storage changes or recovery actions.

## MUST
- Distinguish clearly between analyze, recommend, prepare, and execute authority.
- Require human approval before destructive deletion, reformatting, irreversible migration, production deployment, security weakening, key rotation, retention reduction, or high-risk access change unless an explicit pre-authorized emergency runbook applies.
- Preserve an auditable record of approvals and executed actions.

## MUST NOT
- Infer execution authority from permission to inspect or recommend.
- Force-push, rewrite history, destroy infrastructure, or bypass approval gates to unblock work.
- Execute ambiguous destructive commands when target scope is uncertain.

## SHOULD
- Prefer two-person review for actions with broad or irreversible data impact.
- Design automation so high-risk steps require explicit confirmation tokens or gated workflows.

## Exceptions
Emergency authority must be predefined, time-bounded, least-privileged, and retrospectively reviewed.

## Verification
Inspect RBAC, workflow gates, approval records, audit logs, command history, and incident procedures.