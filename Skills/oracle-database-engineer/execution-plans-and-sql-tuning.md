# Execution Plans and SQL Tuning

## Purpose
Diagnose and improve slow Oracle SQL using actual execution evidence rather than hints or indexing guesses.

## When to use
Use for latency regressions, high DB time, CPU/I/O hot SQL, or unstable plans.

## Inputs
SQL text/SQL_ID, actual plans, bind values or selectivity patterns, AWR/ASH or equivalent metrics, schema statistics, workload context.

## Context to inspect
DBMS_XPLAN output with runtime statistics, cardinality estimates, join methods, access paths, predicates, spills, parallelism, adaptive behavior, bind peeking, and plan history.

## Core knowledge
The optimizer chooses plans from estimated cardinalities and costs. The largest estimate-to-actual mismatches and highest-row operations usually reveal the useful investigation path.

## Procedure
1. Confirm the user-visible symptom and workload window.
2. Identify SQL contribution to DB time and resource use.
3. Capture the actual executed plan, not only EXPLAIN PLAN.
4. Compare estimated versus actual rows by operation.
5. Inspect predicates, conversions, join order, access paths, and temp spills.
6. Check statistics quality and bind/selectivity variation.
7. Test the smallest justified query, schema, or statistics change.
8. Avoid hints until root cause is understood.
9. Compare before/after elapsed time, CPU, logical reads, physical I/O, and plan stability.
10. Protect the change with regression evidence.

## Decision points
Rewrite SQL when semantics or optimizer visibility are poor; add/change indexes when access-path economics justify them; use plan management when a known-good plan needs controlled stability.

## Common failure patterns
Tuning EXPLAIN PLAN, adding indexes blindly, forcing hints globally, measuring only elapsed time, and ignoring bind-sensitive workloads.

## Verification
Use identical representative inputs and workload conditions; inspect actual plan statistics and system impact.

## Expected output
A root-cause explanation, measured remediation, and plan-stability strategy.

## Stop conditions
Stop when representative binds/data are unavailable or changes would alter business semantics without owner approval.