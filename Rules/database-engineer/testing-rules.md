# Database Testing Rules
## Purpose
Detect correctness, migration, concurrency, and performance regressions before production.
## Scope
Schema tests, integration tests, migration tests, concurrency tests, and performance tests.
## MUST
- Test critical database behavior against the actual engine or a behaviorally equivalent environment when engine semantics matter.
- Verify migrations both from supported prior states and against representative data volumes.
- Include failure and concurrency tests for critical transactional invariants.
## MUST NOT
- Treat mocks as proof of database-specific locking, isolation, SQL, or migration behavior.
- Use performance results from tiny datasets as production-scale evidence.
## SHOULD
- Maintain deterministic fixtures that preserve representative cardinality and edge cases.
## Exceptions
Test substitutions require documented semantic limitations and compensating verification.
## Verification
Inspect CI results, engine versions, fixtures, migration rehearsals, concurrency tests, and benchmark methodology.