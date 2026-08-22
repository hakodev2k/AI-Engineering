# Data Integrity Rules
## Purpose
Prevent invalid, contradictory, or orphaned persistent data.
## Scope
Constraints, referential integrity, invariants, validation, and repair.
## MUST
- Enforce critical uniqueness, referential, and domain invariants at the strongest reliable boundary.
- Define behavior for deletes and updates across relationships.
- Validate integrity after bulk loads, migrations, and repairs.
## MUST NOT
- Disable integrity controls without a bounded procedure and post-operation validation.
- Repair production data without preserving evidence and defining rollback or recovery.
## SHOULD
- Detect integrity drift proactively with automated checks where cost-effective.
## Exceptions
Require reason, affected scope, risk, recovery plan, validation, and approval for production changes.
## Verification
Review constraints, integrity queries, migration logs, tests, and post-change evidence.