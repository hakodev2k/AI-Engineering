# AI Product Metrics and KPIs

## Purpose
Define metrics that connect AI behavior to user outcomes, product value, reliability, and economics.

## When to use
Use when launching an AI feature, revising goals, diagnosing adoption, or evaluating whether quality improvements matter commercially.

## Inputs
Product goals, user journeys, model evals, funnel data, reliability metrics, cost data, support signals.

## Context to inspect
Event instrumentation, usage segments, retention cohorts, failure logs, model versions, latency, cost, and customer feedback.

## Core knowledge
AI products need multiple metric layers: business outcome, user task success, behavior quality, reliability, safety, latency, and cost. A single engagement metric can reward poor or compulsive experiences.

## Procedure
1. Define the user outcome the feature should improve.
2. Select one primary product metric tied to that outcome.
3. Add task-success and quality metrics.
4. Add reliability, latency, and cost guardrails.
5. Add risk or safety metrics where relevant.
6. Segment by task, customer, language, model, and workflow where meaningful.
7. Define target, warning, and rollback thresholds.
8. Validate metric instrumentation against raw examples.
9. Review metric relationships rather than optimizing each independently.

## Decision points
Prefer outcome metrics over raw generations, messages, or token volume. Use proxies only when their relationship to value is validated.

## Common failure patterns
Vanity metrics, unsegmented averages, no cost metric, optimizing response rate over task completion, and metrics that cannot trigger decisions.

## Verification
Recompute metrics from sampled events and confirm known good and bad product changes move metrics in expected directions.

## Expected output
A KPI hierarchy with definitions, segmentation, targets, guardrails, and operational thresholds.

## Stop conditions
Stop when instrumentation cannot support trustworthy measurement or the primary outcome remains undefined.