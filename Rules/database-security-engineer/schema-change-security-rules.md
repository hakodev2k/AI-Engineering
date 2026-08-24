# Schema Change Security Rules

## Purpose
Prevent schema changes from weakening confidentiality, integrity, authorization, or auditability.

## Scope
Covers tables, views, procedures, triggers, functions, indexes, permissions, constraints, and migration tooling.

## MUST
- Schema changes MUST be reviewed for data classification, privilege, exposure, integrity, and audit impact.
- New sensitive fields MUST receive appropriate access, encryption/masking, retention, and logging treatment before production use.
- Security-definer procedures, triggers, and executable database objects MUST have explicit privilege and input-boundary review.
- Destructive or irreversible migrations MUST have approved recovery or migration strategy before execution.
- Migration identities MUST have only the privileges required for the controlled change window.

## MUST NOT
- Schema migrations MUST NOT silently broaden application or human access.
- Constraints or security predicates MUST NOT be removed merely to make a migration pass without impact analysis.
- Production destructive DDL MUST NOT be executed without explicit human approval.

## SHOULD
- Use automated schema diffing and policy checks.
- Prefer backward-compatible staged migrations for high-availability systems.

## Exceptions
Exceptions require documented reason, affected controls, evidence, rollback/recovery, monitoring, and approval.

## Verification
Review migration diffs, effective grants, object ownership, constraints, security predicates, test results, rollback evidence, and post-migration access checks.