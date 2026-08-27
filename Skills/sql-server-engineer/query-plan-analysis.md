# Query Plan Analysis

## Purpose
Diagnose SQL Server query performance using actual execution evidence rather than intuition.

## When to use
Use for slow, CPU-heavy, I/O-heavy, or regressed queries. Do not tune solely from estimated plans when runtime evidence is available.

## Inputs
Query text, parameters, actual execution plan, runtime metrics, schema, indexes, statistics, workload context.

## Preconditions
Use a representative environment and preserve the original query and measurements.

## Context to inspect
Inspect Query Store, waits, SET STATISTICS IO/TIME output, actual plan operators, cardinality estimates, spills, warnings, parallelism, indexes, and parameter values.

## Core knowledge
Cost percentages are optimizer estimates, not measured elapsed time. Cardinality errors propagate into join, memory-grant, and access-path choices. A plan must be interpreted with workload concurrency and cache behavior.

## Procedure
1. Capture a reproducible baseline.
2. Confirm the dominant resource: CPU, reads, writes, memory, or waits.
3. Obtain the actual plan with representative parameters.
4. Compare estimated versus actual row counts.
5. Inspect scans/seeks, joins, sorts, lookups, spills, implicit conversions, and warnings.
6. Trace the first major estimation or row-flow divergence.
7. Check statistics and candidate indexes.
8. Evaluate query rewrites only after identifying the bottleneck.
9. Re-run with identical inputs.
10. Test concurrency and plan stability when production impact is material.

## Decision points
Prefer statistics fixes when estimates are stale; indexes when access paths are structurally weak; rewrites when predicates or relational shape block optimization. Avoid hints unless evidence shows the optimizer cannot reliably choose an acceptable plan.

## Common failure patterns
Tuning by operator cost percentage, adding overlapping indexes, ignoring parameter sensitivity, testing only warm cache, and accepting lower latency with much higher CPU.

## Verification
Compare elapsed time, CPU, logical reads, spills, waits, row estimates, and plan stability before and after. Implementation is not verification until representative measurements improve without unacceptable regressions.

## Expected output
A measured root cause, chosen remediation, before/after evidence, and documented residual risk.

## Stop conditions
Stop when representative evidence cannot be obtained, the change requires unsafe production experimentation, or the remediation changes business semantics.