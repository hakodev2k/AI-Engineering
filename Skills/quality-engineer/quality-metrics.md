# Quality Metrics

## Purpose
Build metrics that reveal product and engineering quality without incentivizing superficial test activity.

## When to use
Use for quality dashboards, improvement programs, release reviews, and leadership reporting.

## Inputs
Defects, incidents, test runs, deployment data, customer signals, telemetry, delivery metrics.

## Context to inspect
Inspect data definitions, collection bias, severity model, denominators, ownership, and decision use cases.

## Core knowledge
Metrics are proxies. Favor outcomes and trends: escaped defect impact, change failure rate, detection time, recovery time, flaky-test rate, critical-path coverage, and recurrence. Test count alone is weak.

## Procedure
1. Define decisions the metrics should support.
2. Choose a small balanced set of leading and lagging indicators.
3. Define formulas, scope, severity, and time windows.
4. Validate source quality and missing-data behavior.
5. Segment by meaningful dimensions without exposing individuals.
6. Establish baselines and trends.
7. Pair metrics with qualitative investigation.
8. Review for gaming and unintended incentives.
9. Retire metrics that no longer drive decisions.

## Decision points
Use rates and impact-weighted measures when raw counts are distorted by volume.

## Common failure patterns
Ranking engineers by bugs, celebrating test counts, comparing teams with different contexts, and changing definitions silently.

## Verification
Recalculate samples from source data and confirm stakeholders interpret each metric consistently.

## Expected output
A trustworthy metric dictionary and decision-oriented dashboard.

## Stop conditions
Stop when data cannot support valid conclusions or metrics create harmful individual surveillance incentives.