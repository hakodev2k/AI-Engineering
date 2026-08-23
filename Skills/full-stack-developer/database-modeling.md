# Database Modeling

## Purpose
Design persistent data models that preserve business invariants and support expected access patterns.

## When to use
New features, schema changes, data migrations, or persistent performance/correctness problems.

## Inputs
Domain concepts, invariants, query patterns, scale, retention, consistency requirements.

## Context to inspect
Schema, constraints, indexes, migrations, ORM mapping, query plans, data volume and growth.

## Core knowledge
Model around durable business facts and access patterns. Constraints protect correctness; indexes accelerate specific reads at write/storage cost; normalization and denormalization are trade-offs.

## Procedure
1. Identify entities, relationships, lifecycle, and invariants.
2. Choose keys and data types deliberately.
3. Encode required constraints in the database where possible.
4. Model cardinality and ownership.
5. List critical reads and writes.
6. Design indexes from measured access patterns.
7. Define concurrency and transaction expectations.
8. Plan migrations and rollback/forward recovery.
9. Test representative volumes.
10. Review retention and sensitive-data requirements.

## Decision points
Normalize by default for integrity; denormalize for measured read needs with an explicit consistency strategy. Choose relational versus non-relational storage from workload semantics, not fashion.

## Common failure patterns
Missing constraints, oversized text types, accidental cascade deletes, indexes without workload evidence, ORM-driven schema design, and unsafe migrations.

## Verification
Migration succeeds on representative data; constraints reject invalid states; critical queries have acceptable plans; rollback or forward-fix procedure is documented.

## Expected output
A safe schema and migration plan aligned with workload needs.

## Stop conditions
Stop before destructive migration without validated backup/recovery and approval.