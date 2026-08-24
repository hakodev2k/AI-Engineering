# Senior Change and Approval
## Purpose
Keep high-impact edge actions within explicit authority and evidence boundaries.
## Scope
Production, security, data, infrastructure, and public-contract changes.
## MUST
- Work MUST distinguish analysis, recommendation, preparation, and execution.
- Irreversible or high-blast-radius changes MUST document impact, evidence, rollback or recovery, and approver.
- Human approval MUST precede production deployment, destructive data action, infrastructure destruction, secret rotation, security-control weakening, breaking public contracts, or similarly high-risk access changes.
## MUST NOT
- MUST NOT interpret technical ability as authorization.
- MUST NOT force-push or rewrite shared Git history without explicit approval.
- MUST NOT conceal uncertainty in risk assessments.
## SHOULD
- Prefer reversible, incremental changes with measurable checkpoints.
## Exceptions
Emergency authority must be explicitly defined by the operating organization; actions remain auditable and subject to review.
## Verification
Inspect change records, approvals, diffs, rollback evidence, audit logs, and post-change validation.