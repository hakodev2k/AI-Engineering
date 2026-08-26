# Production Safety and Approval Rules
## Purpose
Constrain dangerous actions and preserve human authority over high-impact changes.
## Scope
Production writes, deletions, backfills, configuration, security controls, and public data contracts.
## MUST
- Work MUST distinguish analysis, recommendation, preparation, and execution.
- Human approval MUST precede destructive data changes, irreversible migrations, production backfills, breaking public contracts, security weakening, secret rotation, or high-risk access changes.
- Approved execution MUST define scope, validation, monitoring, and recovery steps.
## MUST NOT
- MUST NOT force push, rewrite shared history, destroy infrastructure, delete production data, or bypass controls without explicit authorization.
- MUST NOT interpret permission to analyze as permission to execute.
## SHOULD
- High-risk actions SHOULD be reversible, staged, and peer reviewed.
## Exceptions
Emergency procedures require pre-authorized policy or explicit incident authority and full auditability.
## Verification
Inspect approval records, change tickets, command/audit logs, rollback evidence, access controls, and post-change validation.