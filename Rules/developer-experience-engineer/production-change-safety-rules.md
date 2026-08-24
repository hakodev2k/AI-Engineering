# Production Change Safety Rules
## Purpose
Constrain developer-experience work that can alter production services, infrastructure, data, or security posture.
## Scope
Deployments, configuration, infrastructure, data operations, secret rotation, access changes, and shared production tooling.
## MUST
- Analyze, recommend, prepare, and execute permissions MUST be treated as distinct authorities.
- Production deployment, destructive data actions, infrastructure destruction, secret rotation, high-risk access changes, and weakened security controls MUST require authorized human approval.
- High-impact changes MUST have verification and rollback or explicitly approved irreversibility.
- Execution evidence MUST be auditable.
## MUST NOT
- MUST NOT force push, rewrite shared history, delete production data, or perform irreversible migration without explicit authorization.
- MUST NOT infer execution permission from permission to analyze or prepare.
- MUST NOT bypass change controls to reduce developer friction.
## SHOULD
- Changes SHOULD be reversible, staged, and least-privilege.
- Dry-run and plan output SHOULD precede high-impact execution where supported.
## Exceptions
Emergency procedures require designated authority, bounded scope, documented rationale, and post-action review.
## Verification
Review approvals, plans, diffs, audit logs, deployment evidence, rollback tests, access records, and post-change health signals.