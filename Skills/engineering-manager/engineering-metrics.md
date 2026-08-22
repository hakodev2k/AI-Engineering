# Engineering Metrics

## Purpose
Use metrics to understand system and delivery health, guide decisions, and test improvement hypotheses without turning measurements into harmful individual targets.

## When to use
Use for operational reviews, delivery improvement, reliability investment, planning, and organizational health analysis.

## Inputs
Delivery events, incident data, quality signals, operational metrics, work-item data, cost data, and business outcomes.

## Context to inspect
Inspect metric definitions, data quality, aggregation level, incentives created, and whether a measure can actually answer the decision question.

## Core knowledge
Metrics are proxies. Measures such as lead time, deployment frequency, change failure, recovery time, reliability, escaped defects, and flow can illuminate systems but become misleading when used to rank individuals.

## Procedure
1. Start with a decision or hypothesis, not available dashboards.
2. Select a small set of outcome and leading indicators.
3. Define calculation and data boundaries precisely.
4. Validate data completeness and known biases.
5. Establish baseline and natural variation.
6. Segment where aggregation hides important differences.
7. Pair speed metrics with quality and reliability signals.
8. Review trends and investigate causes before prescribing action.
9. Test interventions and measure effects.
10. Retire metrics that no longer inform decisions.

## Decision points
Prefer team or system-level metrics for improvement. Use qualitative evidence when quantitative proxies cannot represent the phenomenon reliably.

## Common failure patterns
Lines of code or ticket counts as productivity, metric targets that invite gaming, dashboard proliferation, comparing unlike teams, and treating correlation as causation.

## Verification
Verify every metric has a defined purpose, calculation, owner, data-quality caveats, and a decision it can influence.

## Expected output
A focused engineering measurement system with baselines, interpretations, caveats, and review cadence.

## Stop conditions
Stop when a proposed metric creates unsafe incentives, exposes inappropriate employee surveillance, or lacks sufficiently reliable data for the intended decision.