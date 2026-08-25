# Production Approval Rules

## Purpose
Ensure high-impact execution remains within authorized human control.

## Scope
Production deployments, destructive actions, security weakening, secret rotation, access changes, and irreversible migrations.

## MUST
- Pipelines MUST distinguish analyze, recommend, prepare, and execute permissions.
- High-risk production execution MUST require explicit approval from an authorized human or formally approved control system.
- Approval evidence MUST identify target, revision/artifact, action, actor, and time.
- Material changes after approval MUST invalidate the approval and require reevaluation.
- Emergency approvals MUST remain auditable and trigger retrospective review.

## MUST NOT
- MUST NOT infer approval from silence, prior unrelated approval, or successful testing.
- MUST NOT allow an AI agent or automation to silently exceed delegated execution authority.
- MUST NOT weaken a required security control merely to unblock delivery.

## SHOULD
- Approval policies SHOULD be risk-tiered to avoid unnecessary friction on low-risk changes.

## Exceptions
Only documented emergency procedures may alter normal approval flow; scope, approver, reason, evidence, and follow-up are mandatory.

## Verification
Inspect environment protection settings, authorization rules, audit logs, approval invalidation behavior, and representative blocked unauthorized executions.