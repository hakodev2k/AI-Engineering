# Data Quality Observability

## Purpose
Design dashboards and telemetry that make AI data quality status understandable, actionable, and attributable across pipelines.

## When to use
Use when operationalizing data quality, reducing incident detection time, or consolidating fragmented quality checks.

## Inputs
Quality metrics, pipeline topology, ownership metadata, incident history, consumer SLAs, dataset criticality.

## Preconditions
Important data products and quality dimensions are identified.

## Context to inspect
Metrics platform, orchestrator, dataset registry, lineage system, alerting stack, dashboards, runbooks, and on-call ownership.

## Core knowledge
Useful observability connects symptoms to dataset, source, pipeline stage, consumer, and owner. High-cardinality AI data requires careful aggregation and slicing to expose concentrated failures without overwhelming operators.

## Procedure
1. Inventory existing quality signals.
2. Normalize metric names and dimensions.
3. Add dataset, source, version, and owner labels.
4. Build health views for completeness, freshness, validity, drift, and volume.
5. Link metrics to lineage and deployment events.
6. Define actionable alert thresholds.
7. Add segment-level views for critical populations.
8. Create drill-down paths to failed samples.
9. Test dashboards during simulated incidents.
10. Review alert usefulness after real incidents.

## Decision points
Prefer metrics tied to decisions and response actions over vanity scores. Sample detailed records while preserving aggregate coverage.

## Common failure patterns
Single composite quality score, dashboards without owners, no historical baseline, alerts without affected dataset version, and excessive cardinality.

## Verification
A responder can identify affected data, source, scope, and owner from observability without manually reconstructing the entire pipeline.

## Expected output
Operational data-quality dashboards, alerts, ownership mappings, and drill-down links.

## Stop conditions
Stop when critical pipeline stages emit no reliable telemetry or ownership cannot be assigned.