# Statistics and Optimizer Management

## Purpose
Maintain optimizer statistics and plan-control mechanisms so Oracle produces stable, evidence-based plans as data changes.

## When to use
Use for plan regressions, skewed data, rapidly changing tables, partition maintenance, or optimizer upgrades.

## Inputs
Statistics metadata, SQL plans, data distributions, modification rates, maintenance windows, optimizer settings.

## Context to inspect
Table/index/column stats, histograms, extended statistics, stale percentage, incremental stats, dynamic sampling, SQL plan baselines, profiles, and optimizer version settings.

## Core knowledge
Statistics describe data, not performance. Histograms and extended stats should solve real estimation problems; indiscriminate collection can cause churn and maintenance cost.

## Procedure
1. Identify affected SQL and cardinality-estimation failures.
2. Compare object statistics with actual data distribution and change rate.
3. Determine whether histograms or column-group stats are justified.
4. Configure collection cadence and sample strategy from workload needs.
5. Use incremental statistics for large partitioned objects where beneficial.
6. Test stats changes in a controlled environment or pending mode when possible.
7. Use plan baselines selectively for critical stability.
8. Monitor plan changes after refreshes and upgrades.
9. Document manual overrides and expiration criteria.

## Decision points
Prefer accurate stats over hints. Use plan baselines when known-good stability matters more than optimizer freedom; avoid locking stats unless a specific operational reason exists.

## Common failure patterns
Gathering all stats during incidents, histogram proliferation, stale locked stats, global optimizer parameter changes, and permanent plan pins without review.

## Verification
Compare estimate-to-actual rows, plan choices, collection duration, and critical SQL performance before/after.

## Expected output
A statistics policy and targeted optimizer controls with measurable stability.

## Stop conditions
Stop when the data distribution or workload cannot be reproduced well enough to assess plan impact.