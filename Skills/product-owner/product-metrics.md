# Product Metrics

## Purpose
Define and use product measures that reveal whether delivered work changes user and business outcomes.

## When to use
Use when setting goals, evaluating releases, diagnosing adoption, or choosing between competing improvements.

## Inputs
Product goals, user journey, event data, business model, baseline metrics, and known data-quality limitations.

## Context to inspect
Inspect metric definitions, instrumentation, segmentation, time windows, seasonality, data lineage, and existing dashboards.

## Core knowledge
Metrics can be leading or lagging, behavioral or business, and guardrail or target measures. Avoid optimizing a proxy without understanding how it can be gamed or distorted.

## Procedure
1. Translate the product goal into observable behavior or outcome.
2. Define a primary metric and relevant guardrails.
3. Establish baseline and target ranges.
4. Specify numerator, denominator, cohort, and time window precisely.
5. Check instrumentation and data quality.
6. Segment where aggregate metrics can hide important behavior.
7. Define expected direction before release.
8. Monitor after change with appropriate comparison periods.
9. Investigate unexpected movement before claiming causality.
10. Use evidence to continue, adapt, or stop work.

## Decision points
Use funnels for journey conversion, retention cohorts for recurring value, task success for workflow quality, and business metrics only when attribution is credible.

## Common failure patterns
Vanity metrics, changing definitions, no baseline, metric overload, confusing correlation with causation, and ignoring guardrail regressions.

## Verification
Metric definitions are reproducible, data is trustworthy enough for the decision, and the metric can distinguish meaningful success from mere feature usage.

## Expected output
A documented measurement model with baseline, targets, guardrails, segmentation, and interpretation guidance.

## Stop conditions
Stop when data quality is inadequate, measurement would violate privacy obligations, or attribution claims exceed available evidence.