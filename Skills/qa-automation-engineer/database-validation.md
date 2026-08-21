# Database Validation

## Purpose
Validate persistence behavior, data integrity, migrations, and concurrency effects without coupling every test to database implementation.

## When to use
Use for data-heavy features, migrations, transactions, reporting, concurrency, and defects involving persistence.

## Inputs
Schema, domain invariants, migration scripts, queries, transaction behavior, test data.

## Context to inspect
Constraints, indexes, relationships, isolation level, triggers, defaults, generated values, retention, and application transaction boundaries.

## Core knowledge
Prefer validating behavior through public interfaces; inspect the database directly when persistence itself is the risk. Tests should distinguish application bugs from data/setup errors.

## Procedure
1. Identify persistence invariants and risky transformations.
2. Create minimal isolated data.
3. Exercise writes through the normal application boundary when possible.
4. Verify durable state and relationships.
5. Test rollback/partial-failure behavior.
6. Exercise duplicate/concurrent updates where relevant.
7. Validate migrations on representative schema/data snapshots.
8. Check backward/forward compatibility during rolling deployments if required.
9. Clean data safely.

## Decision points
Use direct SQL assertions for database-specific guarantees; use API assertions for user-visible semantics. Avoid asserting incidental column details.

## Common failure patterns
Tests tied to ORM internals, shared database records, missing transaction-failure cases, migrations tested only on empty databases, unsafe cleanup.

## Verification
Run migration and persistence tests from clean and representative prior states; confirm constraints and rollback behavior under failure.

## Expected output
Focused evidence for data integrity, migration safety, and transactional behavior.

## Stop conditions
Escalate before destructive migration testing on non-disposable or production data.