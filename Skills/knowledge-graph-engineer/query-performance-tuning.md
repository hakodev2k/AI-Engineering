# Query Performance Tuning

## Purpose
Diagnose and improve slow graph queries using evidence from plans, cardinality, indexes, traversal shape, and workload behavior.

## When to use
Use when graph latency, CPU, memory, or I/O exceeds targets, after schema growth, or before production launch of critical queries.

## Inputs
Slow query, parameters, execution plan, schema, indexes, data distribution, resource metrics, and latency SLO.

## Preconditions
Reproduce the issue on representative data and preserve the original query and measurements.

## Context to inspect
Plan operators, estimated versus actual cardinality, index selectivity, cache behavior, high-degree nodes, path expansion, concurrency, and result size.

## Core knowledge
Graph performance is often dominated by poor starting selectivity, explosive fan-out, unnecessary path exploration, large intermediate results, or mismatched indexes. Optimization must preserve semantics.

## Procedure
1. Capture baseline latency and resource use.
2. Inspect the execution plan.
3. Identify the first major cardinality expansion.
4. Verify indexes serve selective entry predicates.
5. Bound path traversal and reduce unnecessary optional branches.
6. Move safe filters earlier.
7. Remove redundant projections and aggregations.
8. Consider precomputation or denormalization for repeated expensive topology.
9. Re-run with realistic parameter distributions.
10. Test concurrency and cold-cache behavior.
11. Compare improvements against baseline and semantic fixtures.
12. Record the limiting factor and regression test.

## Decision points
Add an index only when selectivity and workload justify write/storage cost. Denormalize when repeated traversal dominates and consistency can be governed. Scale hardware only after query and model inefficiencies are understood.

## Common failure patterns
Optimizing one parameter value; adding indexes blindly; using DISTINCT to hide expansion; caching incorrect or highly volatile results; and measuring only warm-cache averages.

## Verification
Confirm identical results, improved p50/p95/p99 latency, acceptable memory/CPU, stable performance under concurrency, and no material write regression.

## Expected output
Root cause, tuned query/model/index changes, before/after evidence, and regression safeguards.

## Stop conditions
Stop when production-only data is required without access, or optimization requires a high-risk schema migration needing approval.