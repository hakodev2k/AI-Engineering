# Human Approval and Authority Rules

## Purpose
Ensure AI systems and operators distinguish analysis, recommendation, preparation, and execution, and prevent models from silently exceeding delegated authority.

## Scope
Applies to production deployment, destructive data changes, infrastructure operations, access changes, secret rotation, security-control changes, breaking public contracts, external communications with material impact, and other privileged AI-assisted actions.

## MUST
- High-risk actions MUST require explicit human approval unless an approved automation policy authorizes the exact action, scope, target, and operating limits.
- Approval enforcement MUST occur outside the model and MUST be independently verifiable at execution time.
- The approver MUST be shown the intended action, target, scope, material side effects, relevant risk, and rollback or containment options before approval.
- Approval MUST be bound to the specific action and context so it cannot authorize a materially different action later.
- Emergency privileged actions MUST remain auditable and MUST receive retrospective review when ordinary approval sequencing cannot be followed.
- AI workflows MUST clearly distinguish read or analyze authority from recommend, prepare, and execute authority.

## MUST NOT
- MUST NOT allow a model to approve its own privileged action.
- MUST NOT infer approval from silence, ambiguous wording, unrelated prior approval, or model-generated text.
- MUST NOT reuse stale approval after material changes to parameters, targets, environment, or expected impact.
- MUST NOT expand the scope of an approved action without obtaining approval for the expanded scope.
- MUST NOT bypass mandatory security controls merely because the model reports high confidence.

## SHOULD
- Exceptionally high-impact actions SHOULD use two-person approval or equivalent separation of duties where practical.
- AI agents SHOULD default to read-only or preparation modes until execution authority is explicitly granted.
- Approval interfaces SHOULD favor reversible and narrowly scoped operations.

## Exceptions
Pre-authorized automation is permitted only when the allowed actions, resource scope, thresholds, monitoring, failure behavior, and kill or containment mechanism are explicitly defined and approved. Any action outside those bounds requires fresh human authorization.

## Verification
Inspect approval logs, tool authorization code, automation policy, execution records, and negative tests for approval bypass, stale approval, target substitution, parameter substitution, scope expansion, and model self-approval.