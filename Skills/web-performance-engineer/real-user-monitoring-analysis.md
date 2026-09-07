# Real User Monitoring Analysis

## Purpose
Use production telemetry to understand actual web performance, affected cohorts, causal changes, and user impact.

## When to use
Use for performance baselining, regression detection, release comparison, geographic/device analysis, and prioritizing optimization work.

## Inputs
RUM events, navigation/resource timing, Web Vitals attribution, release identifiers, route metadata, device/network dimensions, business events.

## Context to inspect
Review sampling, consent constraints, bot filtering, clock/timestamp quality, SPA navigation instrumentation, metric definitions, aggregation windows, and cardinality limits before interpreting dashboards.

## Core knowledge
RUM is observational and heterogeneous. Percentiles, distributions, cohort sizes, and confidence matter more than global averages. Instrumentation changes can look like product regressions. Correlation between latency and conversion is not automatically causation.

## Procedure
1. Verify telemetry completeness and metric semantics.
2. Establish stable route and release dimensions.
3. Compare distributions at p50, p75, p90, and p95 as appropriate.
4. Segment by device, browser, network, geography, and journey.
5. Locate the earliest release or time window where behavior changes.
6. Correlate with deploys, experiments, third parties, and infrastructure events.
7. Use attribution fields to identify dominant contributors.
8. Quantify affected traffic and business exposure.
9. Create a falsifiable hypothesis and reproduce representative cases.
10. Validate remediation in both telemetry and business guardrails.

## Decision points
Use coarse dimensions when traffic is low; drill down only while sample size remains defensible. Prefer release-based comparison over arbitrary calendar windows when deployments are frequent. Use controlled experiments when business causality materially affects prioritization.

## Common failure patterns
Averages hiding tail pain; comparing unequal cohorts; missing SPA soft-navigation events; changing sampling mid-analysis; high-cardinality dimensions causing gaps; interpreting a telemetry schema change as performance improvement.

## Verification
Check event volumes, missingness, segment sizes, release alignment, and consistency with synthetic traces. Confirm the measured improvement persists beyond deployment warm-up.

## Expected output
A production performance analysis with affected cohorts, quantified impact, evidence, and prioritized hypotheses.

## Stop conditions
Stop and repair instrumentation when metric definitions, sampling, or release attribution are unreliable enough to invalidate conclusions.