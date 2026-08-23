# Room Data Layer and Migrations

## Purpose
Design and evolve local relational persistence with Room while preserving data integrity, query performance, and upgrade safety.

## When to use
Use when adding tables, changing schemas, reviewing DAO behavior, diagnosing data corruption, or preparing an app upgrade.

## Inputs
Entity model, schema history, DAO queries, migration requirements, expected data volume, concurrency model, test fixtures.

## Preconditions
Know which data is authoritative, cacheable, reconstructable, or user-generated.

## Context to inspect
Entities, indices, foreign keys, DAOs, transactions, converters, migration classes, exported schemas, repositories, and query call sites.

## Core knowledge
Room provides compile-time query validation but does not make schema changes safe automatically. Migration design must preserve invariants across every supported upgrade path.

## Procedure
1. Classify persisted data and retention requirements.
2. Review schema normalization and query access patterns.
3. Add indices for demonstrated lookup and join patterns.
4. Define transaction boundaries around atomic business changes.
5. Design migrations from each supported previous version.
6. Avoid destructive fallback for irreplaceable data.
7. Keep converters deterministic and backwards compatible.
8. Test large datasets and concurrent reads/writes.
9. Run migration tests against exported historical schemas.
10. Verify post-migration invariants and query plans where performance matters.

## Decision points
Normalize when consistency dominates; denormalize only when measured read requirements justify duplication. Use transactions for invariants spanning multiple statements.

## Common failure patterns
Missing indices, N+1 access patterns, destructive migrations, long transactions on hot paths, storing derived data without invalidation rules, and migrations tested only from the immediately previous version.

## Verification
Run DAO tests and migration tests for all supported upgrade paths. Confirm row counts, constraints, representative queries, and app startup after migration.

## Expected output
Schema and DAO changes, migration plan, performance considerations, and migration-test evidence.

## Stop conditions
Escalate when required migration is destructive, historical schemas are unavailable, or data ownership rules are unclear.