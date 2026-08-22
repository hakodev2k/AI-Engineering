# Database Testing Rules

## Purpose
Validate data integrity, persistence behavior, migrations, and database-dependent workflows.
## Scope
Relational and non-relational persistence behavior visible to testing.
## MUST
- Test integrity constraints, transactional outcomes, concurrency-sensitive behavior, and critical query semantics where relevant.
- Validate migration effects on representative data before high-risk releases.
- Verify both persisted state and externally observable behavior for critical writes.
## MUST NOT
- Use destructive production data operations for testing without explicit authorization.
- Assume UI output proves underlying data integrity.
## SHOULD
- Include boundary volumes and realistic data distributions for data-sensitive behavior.
## Exceptions
Read-only production verification requires approved access and non-invasive queries.
## Verification
Inspect database state, migration results, constraints, transaction outcomes, and application evidence.