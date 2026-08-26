# Stream Joins

## Purpose
Build correct, scalable joins across streams and tables despite disorder, skew, and evolving state.

## When to use
Use for enrichment, correlation, temporal matching, and multi-stream derived products.

## Inputs
Join keys, event-time semantics, cardinality, lateness, reference-data freshness.

## Context to inspect
Partitioning, window rules, state stores, null handling, update semantics, historical corrections.

## Core knowledge
Stream-stream joins require temporal bounds; stream-table joins depend on table version semantics. Co-partitioning and key distribution determine scalability.

## Procedure
1. Define join business semantics.
2. Select key and time relationship.
3. Measure cardinality/skew.
4. Choose stream-stream, stream-table, interval, or temporal join.
5. Define unmatched and late-event behavior.
6. Bound state.
7. Repartition only when justified.
8. Test disorder, duplicates, missing sides, and updates.

## Decision points
Broadcast small reference state when safe; repartition large datasets. Use temporal joins when historical reference versions matter.

## Common failure patterns
Unbounded joins; accidental many-to-many explosions; stale reference data; mismatched keys; ignoring late matches.

## Verification
Golden datasets prove expected matches/nonmatches and load tests validate state and throughput.

## Expected output
Join specification, state bounds, partition plan, and tests.

## Stop conditions
Stop when join cardinality or temporal semantics cannot be defined.