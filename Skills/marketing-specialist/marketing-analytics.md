# Marketing Analytics

## Purpose
Transform marketing data into trustworthy decisions about performance, customer behavior, allocation, and growth constraints.

## When to use
Use for planning, performance reviews, campaign diagnosis, budget allocation, forecasting, experimentation, and executive reporting.

## Inputs
Business goals, analytics events, CRM data, media spend, revenue or value data, campaign metadata, cohort data, and known data limitations.

## Context to inspect
Inspect metric definitions, event lineage, identity resolution, time zones, currency, attribution logic, missing data, duplicates, bot traffic, consent effects, and reporting transformations.

## Core knowledge
Metrics require definitions, denominators, windows, and ownership. Aggregates can hide cohort or segment changes. Correlation does not establish causality. Data quality must be assessed before interpretation.

## Procedure
1. Translate the business question into measurable outcomes.
2. Define metrics and guardrails precisely.
3. Trace data from source to report.
4. Validate completeness, consistency, and expected ranges.
5. Establish comparable baselines.
6. Segment by meaningful dimensions and cohorts.
7. Separate volume, rate, mix, and value effects.
8. Investigate anomalies using multiple evidence sources.
9. Quantify uncertainty and limitations.
10. Convert findings into decisions, owners, and follow-up measurements.
11. Document definitions and reusable queries or logic.

## Decision points
Use descriptive analysis for what happened, diagnostic analysis for likely causes, experiments for causal questions, and forecasting only when assumptions can be made explicit.

## Common failure patterns
Dashboard-driven analysis without a question, metric definition drift, comparing unequal periods, ignoring seasonality, averaging ratios incorrectly, data leakage, and presenting precision unsupported by data quality.

## Verification
Reconcile key metrics to source systems, reproduce calculations independently, validate sample records, and confirm decision makers interpret definitions consistently.

## Expected output
A decision-oriented analysis with metric definitions, evidence, uncertainty, drivers, implications, and recommended actions.

## Stop conditions
Stop when source data is materially unreliable, definitions conflict without an owner, or privacy rules prohibit the intended analysis.