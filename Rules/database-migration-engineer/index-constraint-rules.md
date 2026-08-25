# Index and Constraint Migration

## Purpose
Change indexes and constraints without unexpected correctness or availability failures.

## Scope
Covers primary keys, foreign keys, unique constraints, checks, and indexes.

## MUST
- New uniqueness or referential constraints MUST be prevalidated against existing data.
- Index creation or rebuild strategy MUST account for lock behavior, log growth, temporary space, and write amplification.
- Constraint validation state MUST be explicit; unvalidated constraints MUST NOT be represented as fully enforced historical integrity.

## MUST NOT
- MUST NOT remove an index without evidence that dependent workloads remain acceptable.
- MUST NOT disable integrity constraints and forget to restore and validate them.

## SHOULD
- Use online or concurrent index operations when supported, tested, and operationally safer.
- Compare query plans before and after material index changes.

## Exceptions
Temporary constraint suspension requires bounded duration, compensating validation, monitoring, and approval.

## Verification
Inspect duplicate/orphan checks, query plans, lock tests, storage estimates, database metadata, and post-change workload metrics.