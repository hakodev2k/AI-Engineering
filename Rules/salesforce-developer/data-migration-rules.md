# Data Migration Rules

## Purpose
Protect correctness and recoverability during Salesforce data loads, transformations, and migrations.

## Scope
Applies to imports, backfills, org consolidations, schema migrations, and production data corrections.

## MUST
- Migrations MUST define source-to-target mapping, validation rules, ownership, and reconciliation criteria.
- High-impact migrations MUST be rehearsed with representative data before production execution.
- Data transformations MUST preserve auditability and identify rejected or ambiguous records.
- Destructive or irreversible production data changes MUST require human approval and recovery planning.

## MUST NOT
- MUST NOT overwrite source data without verified backups or equivalent recovery capability when loss is possible.
- MUST NOT bypass validation or automation without documenting downstream consequences.
- MUST NOT declare completion without reconciliation against expected counts and business invariants.

## SHOULD
- Large migrations SHOULD be chunked to control locks, limits, and recovery scope.
- Dry-run reports SHOULD be produced before high-risk changes.

## Exceptions
Exceptions require documented urgency, risk, evidence, recovery approach, and approval.

## Verification
Compare counts and totals, inspect rejected records, run invariant checks, review logs, and validate rollback or restore procedures.