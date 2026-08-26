# Query Performance Investigation

## Purpose
Diagnose and improve slow MySQL queries using evidence rather than guesswork.

## When to use
Use for latency regressions, high database CPU, excessive rows examined, or slow-query alerts.

## Inputs
Query text, parameters, plans, schema, slow-query data, metrics, workload context.

## Context to inspect
MySQL version, optimizer settings, statistics, indexes, data distribution, concurrency, buffer-pool health, recent releases.

## Core knowledge
Latency may come from poor access paths, cardinality errors, sorting/temp tables, lock waits, I/O, cache misses, or application query shape. Optimize total workload, not isolated microbenchmarks.

## Procedure
1. Confirm the symptom and time window.
2. Identify top queries by total latency and tail latency.
3. Reproduce with representative parameters.
4. Inspect EXPLAIN ANALYZE and rows examined versus returned.
5. Check indexes, join order, predicates, implicit conversions, sorts, and temp tables.
6. Check waits and system resource saturation.
7. Test query rewrite, index, statistics, or schema options separately.
8. Benchmark under representative concurrency.
9. Deploy the lowest-risk effective change.
10. Compare post-change workload metrics.

## Decision points
Rewrite SQL when semantics permit simpler access; add indexes when reuse justifies cost; change schema only when query-level fixes cannot meet requirements.

## Common failure patterns
Testing tiny datasets, optimizing one execution only, forcing indexes prematurely, ignoring parameter skew, and confusing lock time with execution cost.

## Verification
Confirm lower latency, rows examined, CPU/I/O, and no regression to write paths or related queries.

## Expected output
Root-cause statement, evidence, chosen remediation, benchmark, and rollback criteria.

## Stop conditions
Escalate if safe reproduction is impossible, production-only diagnostics require privileged access, or proposed fixes alter business semantics.