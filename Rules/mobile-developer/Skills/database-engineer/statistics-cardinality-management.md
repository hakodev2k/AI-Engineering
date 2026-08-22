# Statistics and Cardinality Management

## Purpose
Maintain optimizer information so query plans reflect real data distributions and row counts.

## When to use
Use for estimate errors, sudden plan regressions, skewed data, rapidly changing tables, and unexplained join or memory choices.

## Inputs
Execution plans, statistics metadata, histograms, row counts, modification rates, parameter distributions, and maintenance configuration.

## Context to inspect
Inspect estimated versus actual rows, statistics age, sampled versus full scans, correlated predicates, skew, ascending keys, and partition behavior.

## Core knowledge
Optimizers estimate cost from imperfect statistics and assumptions. Fresh statistics can help, but correlation, skew, parameter sensitivity, and model limitations may remain.

## Procedure
1. Locate large estimate errors in representative plans.
2. Identify the statistics objects used for affected predicates.
3. Check age, modification count, sample rate, and histogram coverage.
4. Compare production value distributions with optimizer assumptions.
5. Refresh or create statistics when evidence supports it.
6. Consider filtered statistics for stable skewed subsets where supported.
7. Evaluate schema, query, or parameter strategies for persistent estimation limits.
8. Coordinate statistics maintenance with workload windows.
9. Recompile only when justified by stale cached assumptions.
10. Monitor plan quality after changes.

## Decision points
Use automatic maintenance for normal workloads and targeted maintenance for exceptional large or skewed tables. Avoid full scans when cost outweighs expected benefit.

## Common failure patterns
Updating every statistic constantly, blaming all bad plans on stale statistics, ignoring skew, and forcing recompilation indiscriminately.

## Verification
Confirm estimate accuracy and resulting plan/runtime improvements across representative values.

## Expected output
A statistics strategy or targeted correction with evidence and maintenance implications.

## Stop conditions
Stop when the issue is not cardinality-related or maintenance cost cannot be safely accommodated.