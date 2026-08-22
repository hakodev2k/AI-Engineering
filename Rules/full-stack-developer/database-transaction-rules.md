# Database and Transaction Rules

## Purpose
Protect data integrity and predictable persistence behavior.
## Scope
Queries, writes, transactions, concurrency, and ORM usage.
## MUST
- Define transaction boundaries around invariants requiring atomicity.
- Handle concurrent updates with an explicit strategy where lost updates matter.
- Parameterize database input and constrain returned data to what is required.
## MUST NOT
- Use client-side authorization as a substitute for data access controls.
- Introduce unbounded queries on production paths without justification.
## SHOULD
- Measure query behavior with realistic data and execution evidence.
## Exceptions
Broader reads or weaker isolation require documented correctness and performance rationale.
## Verification
Inspect SQL/query plans, transaction tests, concurrency tests, and database metrics.