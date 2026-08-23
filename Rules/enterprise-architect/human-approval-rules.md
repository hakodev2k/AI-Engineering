# Human Approval and Execution Authority Rules

## Purpose
Prevent architecture analysis or AI assistance from silently becoming unauthorized high-impact execution.

## Scope
Production changes, destructive actions, security controls, data, infrastructure, public contracts, and enterprise standards.

## MUST
- Analyze, recommend, prepare, approve, and execute MUST be treated as distinct authority levels.
- Human approval MUST precede production deployment, destructive data operations, irreversible migrations, infrastructure destruction, secret rotation, breaking public contracts, weakening security controls, force push, or high-risk access changes when the architect or agent can trigger them.
- Approval evidence MUST identify scope, approver, risk, and intended action.

## MUST NOT
- MUST NOT infer execution authority from permission to analyze or prepare.
- MUST NOT bypass controls to unblock delivery.

## SHOULD
- Prefer reversible, staged, peer-reviewed changes with rollback paths.

## Exceptions
Emergency authority must be explicitly pre-authorized and retrospectively reviewed.

## Verification
Inspect approval records, change logs, audit trails, deployment controls, and privileged-action history.