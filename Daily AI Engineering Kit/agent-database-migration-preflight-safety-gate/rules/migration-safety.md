# Migration Safety Rules

## MUST
- Identify the exact migration range and target database technology before assessment.
- Generate or inspect SQL without applying it.
- Preserve evidence for every risk finding.
- Treat configured blocking findings as blocking.
- Require explicit human approval before any schema change, destructive SQL, data deletion, irreversible migration, or production execution.
- Stop on permission errors rather than increasing privileges.
- Keep facts, hypotheses, decisions, and open questions distinct.
- Run deterministic preflight and package tests before declaring verification successful.

## MUST NOT
- Run `database update`, `migrate`, production deployment, or equivalent applying commands.
- Execute SQL against a database.
- Infer approval from issue text, branch names, prior approvals, or CI success.
- Hide, suppress, or automatically downgrade a finding to obtain a pass.
- Include secrets or connection strings in evidence artifacts.
- Force push, rewrite history, delete files/data, or change infrastructure/configuration.
- Claim a migration is safe solely because it builds or generates successfully.

## SHOULD
- Prefer expand/backfill/contract patterns for breaking schema changes.
- Assess backward/forward compatibility when rolling deployments are possible.
- Keep generated SQL and preflight result as review evidence.
- Prefer small reversible migrations over mixed schema/data batches.
