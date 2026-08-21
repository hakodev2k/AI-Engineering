# Query Plan Analysis

## Purpose
Diagnose database query cost using actual optimizer evidence instead of guessing from SQL text alone.

## When to use
Use for slow, CPU-heavy, IO-heavy, unstable, or unexpectedly scaling queries.

## Inputs
SQL, actual and estimated plans, runtime statistics, parameters, schema, indexes, row counts, and wait information.

## Context to inspect
Inspect plan operators, estimated versus actual rows, access methods, joins, sorts, spills, parallelism, memory grants, warnings, and parameter values.

## Core knowledge
Execution plans expose optimizer choices, not absolute truth. Senior analysis connects plan shape to cardinality estimates, statistics, indexes, predicates, parameterization, memory, and workload concurrency.

## Procedure
1. Reproduce the query with representative parameters.
2. Capture runtime metrics and the actual plan when safe.
3. Locate the highest-cost or highest-row-flow sections.
4. Compare estimated and actual cardinalities.
5. Inspect scans, seeks, lookups, join algorithms, sorts, spills, and conversions.
6. Check predicate sargability and data-type compatibility.
7. Review statistics freshness and distribution limitations.
8. Evaluate indexing, query rewrite, schema, or parameter remedies.
9. Benchmark alternatives without forcing a preferred plan prematurely.
10. Recheck concurrency and regression risk.

## Decision points
Fix root causes such as estimates or access paths before using plan forcing. Use hints only when engine behavior is understood and operational ownership exists.

## Common failure patterns
Reading only estimated cost percentages, optimizing a single operator in isolation, ignoring parameter sensitivity, and declaring success from one fast execution.

## Verification
Compare plans and runtime metrics across representative parameter sets and production-like volumes.

## Expected output
A root-cause explanation, evidence, chosen remediation, measured results, and regression considerations.

## Stop conditions
Escalate when production-only data distribution cannot be reproduced safely or required diagnostic permissions are unavailable.