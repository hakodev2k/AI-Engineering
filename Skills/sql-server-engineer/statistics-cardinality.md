# Statistics and Cardinality Estimation

## Purpose
Restore reliable optimizer estimates so SQL Server can choose appropriate joins, access paths, memory grants, and parallelism.

## When to use
Use when actual and estimated rows diverge materially, plans regress after data growth, or skewed distributions cause unstable plans.

## Inputs
Actual plans, statistics metadata/histograms, query predicates, parameter values, data distribution, compatibility level.

## Context to inspect
Inspect statistics age and modification counters, sampling, histogram boundaries, ascending keys, correlated predicates, filtered statistics, computed expressions, and cardinality estimator version.

## Core knowledge
Statistics summarize distributions; they do not encode arbitrary multi-column correlation. Sampling quality and predicate shape influence estimates. Compatibility-level changes can alter estimator behavior.

## Procedure
1. Locate the earliest material estimate error.
2. Identify which predicate or join drives it.
3. Inspect relevant statistics and histogram coverage.
4. Check staleness, sampling, skew, and correlation.
5. Test targeted statistics refresh or creation.
6. Recompile in a controlled test when needed to isolate cached-plan effects.
7. Compare estimates and runtime.
8. Assess maintenance implications.

## Decision points
Use FULLSCAN selectively for critical skewed data when sampling is inadequate; filtered statistics for stable subsets; query redesign when statistics cannot model the relationship sufficiently.

## Common failure patterns
Updating every statistic indiscriminately, assuming newer is always better, ignoring parameter sensitivity, and treating estimate mismatch as harmless despite spills or bad joins.

## Verification
Verify estimate accuracy improves at important operators and that CPU, reads, memory grants, spills, and latency remain acceptable across representative parameters.

## Expected output
A documented estimation root cause and minimally invasive statistics or query remediation.

## Stop conditions
Stop if representative distributions cannot be reproduced or compatibility changes require broader regression testing.