# Intelligence Program Metrics and Feedback

## Purpose
Measure whether threat intelligence improves decisions and defensive outcomes rather than merely producing feeds and reports.

## When to use
Use for program reviews, service-level design, source rationalization, staffing decisions, and continuous improvement.

## Inputs
PIRs, product history, consumer feedback, detection/hunt outcomes, source costs, response times, usage telemetry, false-positive data.

## Context to inspect
Identify consumers, promised outcomes, decision cycles, collection costs, analyst effort, and downstream defensive workflows.

## Core knowledge
Activity metrics such as IOC count are weak proxies. Prefer outcome metrics: requirement satisfaction, time-to-answer, detection uplift, prevented duplication, consumer action, and source value.

## Procedure
1. Define desired outcomes for each intelligence service.
2. Map outcomes to measurable leading and lagging indicators.
3. Establish baselines and targets.
4. Track PIR satisfaction and time-to-answer.
5. Measure product consumption and resulting actions.
6. Attribute source contribution where practical.
7. Monitor false positives, stale data, and rework.
8. Gather structured consumer feedback.
9. Review metrics for gaming or perverse incentives.
10. Retire low-value products/sources and reinvest.

## Decision points
Use quantitative metrics for operational processes and qualitative evidence for complex strategic influence; do not force false precision.

## Common failure patterns
Counting reports, maximizing IOC volume, vanity dashboards, no baseline, and measuring analyst busyness instead of decisions improved.

## Verification
Metrics trace to defined outcomes, consumers recognize their meaning, and reviews result in concrete program changes.

## Expected output
Program scorecard with outcome metrics, baselines, trends, feedback, and improvement actions.

## Stop conditions
Stop using a metric when it drives harmful behavior, cannot be interpreted reliably, or exposes sensitive data unnecessarily.