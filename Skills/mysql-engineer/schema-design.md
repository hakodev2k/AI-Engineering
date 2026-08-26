# MySQL Schema Design

## Purpose
Design durable MySQL schemas that preserve invariants while supporting expected access patterns and evolution.

## When to use
Use for new domains, major table changes, or schema reviews. Do not redesign solely for stylistic preference.

## Inputs
Requirements, entities, invariants, read/write patterns, retention needs, scale expectations.

## Context to inspect
Existing naming conventions, MySQL version, storage engine, charset/collation, foreign-key policy, migration tooling, largest tables.

## Core knowledge
Prefer InnoDB, explicit keys, appropriate data types, normalized ownership boundaries, and constraints where operationally safe. Schema design affects locking, indexing, replication, backup, and migration cost.

## Procedure
1. Extract entities, cardinalities, invariants, lifecycle, and ownership.
2. Map dominant queries and mutation paths.
3. Choose stable primary keys and data types.
4. Normalize to remove update anomalies; denormalize only for measured access needs.
5. Define nullability, defaults, unique constraints, foreign keys, and timestamps deliberately.
6. Select charset/collation explicitly.
7. Design indexes from query predicates and ordering.
8. Estimate row width, growth, and hot-table behavior.
9. Review migration and rollback feasibility.
10. Validate representative queries on production-like data.

## Decision points
Use surrogate keys when natural keys are wide/mutable. Use foreign keys when integrity benefit exceeds operational coupling. Denormalize only with an explicit consistency strategy.

## Common failure patterns
Oversized VARCHARs everywhere, nullable fields without semantics, redundant indexes, random wide clustered keys, implicit collations, EAV misuse, and schema optimized for hypothetical queries.

## Verification
Verify DDL, constraints, query plans, representative writes, migration rehearsal, and expected storage growth. Implementation is not verified until realistic access paths are exercised.

## Expected output
Reviewed DDL plus documented assumptions, indexes, invariants, and migration considerations.

## Stop conditions
Escalate when requirements conflict, destructive conversion is unavoidable, or production scale cannot be reproduced sufficiently to assess risk.