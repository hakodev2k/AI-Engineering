# Query Plan Analysis

## Purpose
Diagnose PostgreSQL query performance using planner and executor evidence rather than guesswork.

## When to use
Use for latency regressions, CPU/IO spikes, unexpectedly slow SQL, or plan instability.

## Inputs
SQL, parameters, EXPLAIN output, table/index statistics, workload metrics.

## Context to inspect
PostgreSQL version, planner settings, statistics freshness, data distribution, cache state, concurrency, and query frequency.

## Core knowledge
Interpret scans, joins, sorts, aggregates, loops, estimated versus actual rows, costs, timing, buffers, memory and spill behavior. A bad estimate often causes a bad plan.

## Procedure
1. Capture exact SQL and representative bind values.
2. Establish latency and resource baseline.
3. Run safe EXPLAIN; use ANALYZE only where execution is acceptable.
4. Read from high-cost/high-time nodes outward.
5. Compare estimated and actual cardinalities.
6. Inspect buffers, loops, sort spills, and heap fetches.
7. Trace root cause to statistics, indexing, SQL shape, memory, or data distribution.
8. Change one material factor at a time.
9. Re-measure.
10. Test alternate parameter distributions.

## Decision points
Fix estimates before forcing access paths. Rewrite SQL only when semantics remain explicit and the planner cannot obtain an efficient shape through schema/statistics changes.

## Common failure patterns
Reading cost as milliseconds, optimizing the top node only, ignoring loops, benchmarking warm cache only, using nonrepresentative parameters.

## Verification
Show before/after plans and measured latency/resources under representative load.

## Expected output
Root-cause explanation, evidence, proposed correction, regression test.

## Stop conditions
Stop if ANALYZE would execute destructive SQL or production experimentation lacks safety controls.