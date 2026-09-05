# Graph Query Design

## Purpose
Design correct, maintainable, and performant SPARQL or Cypher queries for graph-backed applications and AI retrieval.

## When to use
Use for new graph APIs, analytics, path queries, knowledge retrieval, or optimization of existing graph workloads.

## Inputs
Business question, graph model, sample data, query engine, expected result shape, latency target.

## Preconditions
Understand graph semantics and cardinalities before optimizing syntax.

## Context to inspect
Indexes, constraints, statistics, query plans, existing conventions, parameterization, pagination, access control.

## Core knowledge
Graph query cost is driven by selectivity, expansion order, path length, variable-length traversal, fan-out, optional matches, aggregation, and index use. Correct semantics must precede micro-optimization.

## Procedure
1. Translate the requirement into explicit graph patterns.
2. Anchor traversal on selective indexed predicates.
3. Bound variable-length paths whenever possible.
4. Avoid accidental Cartesian products.
5. Parameterize user inputs.
6. Handle missing and duplicate semantics explicitly.
7. Inspect execution plans.
8. Measure with realistic cardinalities.
9. Add pagination or limits for unbounded result sets.
10. Add regression tests for correctness and latency.

## Decision points
Prefer precomputed/materialized relationships only when measured traversal cost is persistently unacceptable and freshness trade-offs are understood.

## Common failure patterns
Unbounded traversal, returning whole subgraphs unnecessarily, hidden Cartesian joins, filtering too late, relying on LIMIT without ordering, and ignoring tenant filters.

## Verification
Compare results against fixtures, review plans, test worst-case graph shapes, and confirm latency/error budgets.

## Expected output
A parameterized query, plan evidence, correctness tests, and performance notes.

## Stop conditions
Escalate when required query semantics cannot meet SLOs without model or infrastructure changes.