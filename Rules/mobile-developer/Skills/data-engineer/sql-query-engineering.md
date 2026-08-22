# SQL Query Engineering

## Purpose
Write and review SQL that is correct, maintainable, scalable, and aligned with the database execution model.

## When to use
Use for transformations, analytical queries, reconciliation, data serving, and investigation of expensive SQL workloads.

## Inputs
Schema, query requirements, data distribution, indexes or clustering, execution plans, and workload constraints.

## Context to inspect
Inspect keys, cardinality, null semantics, statistics, partitioning, existing indexes, query engine behavior, and expected result grain.

## Core knowledge
SQL is declarative; performance depends on plans, cardinality estimates, data layout, predicates, join algorithms, sorts, shuffles, and materialization. Correctness depends on grain, nulls, duplicates, and temporal semantics.

## Procedure
1. Define expected output grain and invariants.
2. Filter as early as semantics allow.
3. Select only required columns.
4. Verify join cardinality before aggregation.
5. Avoid accidental row multiplication.
6. Use window functions deliberately and understand sort cost.
7. Inspect execution plan or engine profile for expensive stages.
8. Align predicates with partitions, indexes, or clustering.
9. Benchmark with representative data.
10. Add correctness tests for duplicates, nulls, and boundaries.

## Decision points
Prefer clear set-based SQL over procedural work when the optimizer can execute it efficiently. Materialize intermediate results when reuse, optimizer limitations, or failure recovery justify the storage cost.

## Common failure patterns
SELECT *, non-sargable predicates, hidden many-to-many joins, DISTINCT masking modeling errors, functions on partition keys, and optimizing without an execution plan.

## Verification
Compare results to known cases, inspect plans, measure bytes scanned/runtime, and test at production-like cardinalities.

## Expected output
Correct SQL with documented grain and measured performance appropriate to its workload.

## Stop conditions
Escalate when required indexes or physical changes need database-owner approval or source semantics make correctness indeterminate.