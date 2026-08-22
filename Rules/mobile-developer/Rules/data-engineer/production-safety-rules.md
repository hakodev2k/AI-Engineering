# Production Safety Rules
## Purpose
Control actions that can irreversibly affect production data, pipelines, or downstream consumers.
## Scope
Deployments, destructive SQL, deletes, schema migrations, backfills, access changes, and production configuration.
## MUST
- Destructive SQL, data deletion, irreversible migrations, breaking data contracts, and high-risk access changes MUST require explicit human approval.
- Production changes MUST define expected impact, verification evidence, and rollback or correction strategy.
- Analyze, recommend, prepare, and execute authority MUST remain distinct.
- Irreversible actions MUST verify backups, snapshots, or equivalent recovery safeguards when applicable.
## MUST NOT
- MUST NOT silently execute production actions beyond granted authority.
- MUST NOT disable quality, security, or observability controls merely to unblock a change.
- MUST NOT treat agent confidence as proof that production data is safe.
## SHOULD
- Prefer staged, reversible, partition-bounded, observable changes with limited blast radius.
## Exceptions
Emergency actions require accountable human authorization, bounded scope, retained evidence, and mandatory follow-up review.
## Verification
Inspect approvals, change records, audit logs, backups, deployment evidence, reconciliation, and post-change validation.