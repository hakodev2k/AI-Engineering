# Statistics and Planner Management

## Purpose
Maintain planner statistics and diagnose cardinality-estimation problems that lead to inefficient execution plans.

## When to use
Use when estimates diverge from actual rows, plans change unexpectedly, or skew/correlation defeats default statistics.

## Inputs
EXPLAIN ANALYZE, pg_stats data, schema, data distribution, autovacuum/analyze settings.

## Context to inspect
Column distributions, correlations, expression predicates, extended statistics, partitioning, modification rate, analyze history.

## Core knowledge
PostgreSQL plans from sampled statistics. Histograms, most-common values, ndistinct estimates, correlation and extended statistics influence cardinality and plan choice.

## Procedure
1. Find plan nodes with large estimate errors.
2. Identify predicates/joins responsible.
3. Check statistics freshness and sample adequacy.
4. Inspect skew and correlated columns.
5. Raise per-column statistics targets only when justified.
6. Add extended statistics for dependencies or multicolumn distributions when useful.
7. ANALYZE safely.
8. Replan with representative parameters.
9. Compare estimates and execution.
10. Monitor maintenance cost.

## Decision points
Prefer better statistics over planner-setting hacks. Increase statistics targets selectively because analysis time and catalog size rise.

## Common failure patterns
Global over-tuning, stale stats after bulk loads, ignoring parameter-sensitive plans, treating planner switches as permanent fixes.

## Verification
Estimates should materially approach actual cardinalities and plans should improve across representative inputs.

## Expected output
Statistics diagnosis, targeted changes, before/after plan evidence.

## Stop conditions
Escalate when plan behavior depends on production-only distributions that cannot be safely reproduced or inspected.