# Partitioning Strategy

## Purpose
Use MySQL table partitioning only when it solves a concrete lifecycle, pruning, or operational problem.

## When to use
Use for very large tables where partition pruning, retention drops, or maintenance isolation offers measurable benefit.

## Inputs
DDL, query predicates, data distribution, retention rules, table growth, uniqueness requirements, operational constraints.

## Context to inspect
MySQL version, indexes, primary/unique keys, foreign-key constraints, partition key usage, current maintenance procedures.

## Core knowledge
Partitioning is not automatic sharding and does not fix poor indexing. Effective pruning requires compatible predicates. Partitioning changes key constraints, DDL, statistics, and operational complexity.

## Procedure
1. State the problem partitioning is expected to solve.
2. Confirm simpler indexing/archival solutions are insufficient.
3. Select a partition key aligned with dominant pruning or retention boundaries.
4. Validate unique-key and feature constraints for the MySQL version.
5. Estimate partition count and management overhead.
6. Test representative plans for pruning.
7. Rehearse partition add/drop/reorganization.
8. Define automation for future partitions and retention.
9. Benchmark writes, reads, and maintenance.
10. Document rollback/migration strategy.

## Decision points
Use RANGE partitioning for time/lifecycle boundaries when queries align; avoid partitioning when most queries cannot prune or table size is manageable conventionally.

## Common failure patterns
Partitioning by time while querying by another key, thousands of partitions, missing future partitions, assuming local indexes behave like independent shards, and untested retention jobs.

## Verification
Confirm partition pruning, correct uniqueness semantics, maintenance duration, and no regression to critical queries.

## Expected output
Partition design with measurable justification and lifecycle automation.

## Stop conditions
Stop if constraints/features are incompatible, pruning cannot be demonstrated, or operational complexity exceeds measured benefit.