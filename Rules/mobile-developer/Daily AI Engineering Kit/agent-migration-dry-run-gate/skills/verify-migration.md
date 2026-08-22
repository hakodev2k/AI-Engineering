# Skill: Verify Migration

## Purpose
Prove that a migration is safe enough to advance by checking execution evidence, schema state, application behavior, and rollback readiness.

## Inputs
- Completed migration plan.
- Dry-run command output.
- Before/after schema evidence.
- Test/build results.
- Post-migration verification results.

## Procedure
1. Confirm the dry run targeted a non-production environment.
2. Confirm the executed migration set matches the reviewed migration set.
3. Check process exit codes and database errors.
4. Compare expected versus actual schema changes.
5. Run required application build/tests and migration-specific verification queries.
6. Check data invariants such as row counts, nullability assumptions, uniqueness, and referential integrity when relevant.
7. Verify rollback or roll-forward recovery was tested or remains executable.
8. Inspect the Git diff for unrelated changes.
9. Record unresolved risks and required approvals.
10. Return `verified` only when every required check passes; otherwise return `blocked` or `needs-approval`.

## Expected output
A verification record with status, evidence, failed checks, unresolved risks, and next action.

## Failure handling
Retry only transient tool/environment failures, maximum two attempts. Do not retry deterministic SQL, schema, data, or test failures without changing the plan or implementation.

## Stop conditions
Stop on production execution without approval, inconsistent schema evidence, failed data integrity checks, unverified migration content, or exhausted retry budget.
