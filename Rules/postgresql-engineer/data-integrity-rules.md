# Data Integrity Rules
## Purpose
Ensure committed PostgreSQL data remains valid under concurrency and failure.
## Scope
Constraints, references, uniqueness, validation, and repair.
## MUST
- Enforce durable invariants with NOT NULL, CHECK, UNIQUE, foreign keys, exclusion constraints, or equivalent mechanisms where appropriate.
- Validate integrity assumptions against existing data before enabling constraints.
- Treat integrity violations as defects requiring root-cause analysis.
## MUST NOT
- Disable constraints in production merely to unblock writes.
- Repair corrupted data without preserving an auditable record and validating dependent systems.
## SHOULD
- Use deferred constraints only when transaction semantics genuinely require them.
## Exceptions
Any temporary relaxation requires approval, bounded duration, rollback, and reconciliation evidence.
## Verification
Inspect catalog constraints, run integrity queries, concurrency tests, and post-change reconciliation.