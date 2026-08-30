# Fact Table Design

## Purpose
Design fact tables that preserve a single defensible grain, support correct aggregation, and scale for analytical workloads.

## When to use
Use for transaction, periodic snapshot, accumulating snapshot, or factless fact tables. Apply before implementing transformations that produce analytical measures.

## Inputs
Business events, source records, metric definitions, event timestamps, dimensional keys, retention requirements, expected query patterns.

## Context to inspect
Source cardinality, duplicate behavior, late-arriving records, existing facts, consumer joins, partitioning options, and reconciliation controls.

## Core knowledge
A fact table represents observations at a declared grain. Measures must be evaluated for additivity. Facts may contain foreign keys, timestamps, degenerate dimensions, and lineage fields, but should avoid descriptive duplication that belongs in dimensions.

## Procedure
1. Declare grain in one sentence.
2. Identify the event or state represented.
3. Map required dimension keys.
4. Define measures and aggregation semantics.
5. Select fact type: transaction, snapshot, accumulating snapshot, or factless.
6. Define deduplication and idempotency keys.
7. Handle late and corrected events.
8. Choose partition and clustering keys from workload evidence.
9. Implement reconciliation tests.
10. Validate representative BI queries.

## Decision points
Use transaction facts for immutable events, periodic snapshots for state over intervals, and accumulating snapshots for milestone lifecycles. Split facts when grains or update semantics differ.

## Common failure patterns
Mixed grain, double counting after joins, mutable transaction facts without auditability, missing event identifiers, and using null dimension keys inconsistently.

## Verification
Reconcile counts and totals to sources, test joins for row multiplication, and verify additive behavior across expected dimensions.

## Expected output
A fact design with grain, keys, measures, loading semantics, performance strategy, and reconciliation evidence.

## Stop conditions
Stop when event identity, business grain, or correction semantics cannot be established.