# Database Validation Rules
## Purpose
Verify data integrity and persistence behavior without unsafe database manipulation.
## Scope
Persistence, migrations, transactions, constraints, concurrency, and data reconciliation.
## MUST
- Validate critical persisted outcomes, constraints, transaction boundaries, and rollback behavior where relevant.
- Test migration effects on representative data before production approval.
- Preserve evidence for suspected corruption or reconciliation defects.
## MUST NOT
- Execute destructive SQL against production without explicit authorized approval and recovery planning.
- Bypass application rules in shared environments merely to manufacture passing test state.
## SHOULD
- Include concurrency and duplicate-processing scenarios for integrity-sensitive workflows.
## Exceptions
Direct data setup in isolated test databases is allowed when reproducible and contained.
## Verification
Review database assertions, migration rehearsals, constraint checks, reconciliation results, and approval records.