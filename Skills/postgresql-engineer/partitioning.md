# Table Partitioning

## Purpose
Design and operate PostgreSQL partitioning when data lifecycle, pruning, maintenance, or scale justify the added complexity.

## When to use
Use for very large tables with strong partition keys, time-based retention, or operationally isolated data ranges. Do not partition merely because a table is large.

## Inputs
Table size/growth, queries, retention, key distribution, write pattern, maintenance requirements.

## Context to inspect
Existing indexes/constraints, query predicates, uniqueness needs, foreign keys, ingestion path, planner behavior.

## Core knowledge
Declarative range/list/hash partitioning can improve pruning and lifecycle operations but multiplies objects and operational complexity. Partition keys must align with workload.

## Procedure
1. Quantify the problem partitioning should solve.
2. Choose a stable partition key used by critical predicates/lifecycle.
3. Select partition granularity from data volume and maintenance needs.
4. Define default/future partition handling.
5. Plan local indexes and constraints.
6. Test pruning with representative SQL.
7. Design partition creation/retention automation.
8. Plan migration without unsafe long locks.
9. Load-test ingestion and planning overhead.
10. Monitor partition counts and skew.

## Decision points
Prefer range for temporal/ranged lifecycle, list for bounded categories, hash for even distribution without natural ranges.

## Common failure patterns
Thousands of tiny partitions, missing partition predicates, uniqueness assumptions across partitions, forgotten future partitions.

## Verification
Confirm pruning, retention operations, ingestion throughput, query latency, and constraint behavior.

## Expected output
Partition scheme, lifecycle automation, migration plan, benchmark evidence.

## Stop conditions
Stop when key choice cannot support required uniqueness or workload predicates.