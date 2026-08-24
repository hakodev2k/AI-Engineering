# Database Schema Design

## Purpose
Design durable transactional schemas that preserve integrity while supporting expected access patterns and evolution.

## When to use
Use for new persistent data, major relationship changes, or integrity/performance redesigns.

## Inputs
Domain rules, workloads, query patterns, retention requirements, consistency needs, database capabilities.

## Context to inspect
Existing schema, constraints, indexes, migrations, query plans, data volume/growth, replication and backup strategy.

## Core knowledge
Normalization, keys, constraints, referential integrity, data types, indexing, denormalization, partitioning, transactions, and online migration patterns.

## Procedure
1. Model facts and ownership from domain requirements.
2. Choose stable keys and precise data types.
3. Encode invariants with constraints where practical.
4. Normalize by default; denormalize only for measured access needs.
5. Map critical read/write paths.
6. Design indexes for actual predicates and ordering.
7. Plan schema evolution and rollback/forward recovery.
8. Test representative volume and concurrency.

## Decision points
Prefer database-enforced integrity for durable invariants. Denormalize when measured performance or availability needs justify synchronization cost.

## Common failure patterns
Missing constraints, oversized generic columns, random indexes, hot keys, destructive migrations, nullable-by-default fields, and modeling solely for one query.

## Verification
Validate constraints, migration behavior, query plans, concurrency, representative data volume, backups, and rollback/forward strategy.

## Expected output
An evolvable schema and migration plan aligned to domain integrity and workload evidence.

## Stop conditions
Stop before destructive production changes without backups, approval, migration rehearsal, or a recovery path.