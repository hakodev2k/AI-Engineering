# Query Store Regression Analysis

## Purpose
Use SQL Server Query Store to detect, explain, and safely mitigate plan regressions.

## When to use
Use after deployments, statistics changes, upgrades, compatibility changes, or unexplained performance shifts.

## Inputs
Query Store history, runtime statistics, plans, deployment timeline, workload context.

## Context to inspect
Inspect Query Store state, capture policy, intervals, storage limits, query/plan IDs, waits, forced plans, hints, and recent configuration changes.

## Core knowledge
A regression is a workload-relative deterioration, not merely a new plan. Plan forcing can stabilize service but may become harmful as data and parameters change.

## Procedure
1. Define the regression window.
2. Rank queries by increased duration, CPU, reads, or waits.
3. Compare old and new plans.
4. Correlate changes with deployments and data/statistics events.
5. Identify the causal plan difference.
6. Test permanent remediation.
7. Use plan forcing only as a controlled mitigation when appropriate.
8. Monitor forced-plan success and runtime distributions.

## Decision points
Force a known-good plan for urgent stabilization when semantics are unchanged and workload is understood; prefer durable query, index, or statistics fixes for long-term correction.

## Common failure patterns
Forcing plans without expiry/review, comparing averages that hide parameter classes, letting Query Store fill unexpectedly, and attributing correlation as causation.

## Verification
Confirm the regressed workload returns to acceptable latency/resource levels and no major parameter class deteriorates.

## Expected output
Regression evidence, root cause, mitigation, durable fix, and monitoring criteria.

## Stop conditions
Stop if Query Store history is missing or if forcing a plan could mask an unresolved correctness issue.