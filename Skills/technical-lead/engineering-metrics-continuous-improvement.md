# Engineering Metrics and Continuous Improvement

## Purpose
Use engineering evidence to identify systemic bottlenecks and improve delivery, quality, and reliability without turning metrics into individual performance scores.

## When to use
Use during retrospectives, delivery reviews, reliability improvement, and process redesign.

## Inputs
Lead time, deployment data, change failure, incidents, review times, defect trends, test health, developer feedback.

## Context to inspect
Inspect workflow stages, queue times, rework, dependencies, operational load, and recent process changes.

## Core knowledge
Metrics are signals for systems. Good measures connect to outcomes and can be interpreted with context. Targets can distort behavior when converted into individual quotas.

## Procedure
1. Define the outcome needing improvement.
2. Select a small set of relevant measures.
3. Establish baseline and data quality.
4. Segment data to find bottlenecks rather than relying on averages.
5. Combine quantitative signals with engineer observations.
6. Form a specific improvement hypothesis.
7. Change one meaningful system constraint.
8. Observe impact over an appropriate period.
9. Check for unintended incentives or shifted bottlenecks.
10. Keep, adjust, or revert based on evidence.

## Decision points
Use flow metrics for delivery bottlenecks, reliability metrics for operational quality, and qualitative evidence when numbers cannot capture local friction.

## Common failure patterns
Measuring individuals, vanity metrics, optimizing one stage while worsening the system, and dashboards without decisions.

## Verification
The targeted outcome improves without unacceptable degradation elsewhere, and teams understand how metrics are used.

## Expected output
An evidence-based improvement loop with baseline, hypothesis, intervention, and measured outcome.

## Stop conditions
Stop using a metric when it drives harmful gaming or lacks sufficient data quality for decisions.