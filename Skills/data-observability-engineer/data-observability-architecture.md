# Data Observability Architecture

## Purpose
Design an observability architecture for data systems that makes freshness, volume, schema, quality, lineage, and pipeline health measurable and actionable across batch and streaming workloads.

## When to use
Use when establishing observability for a new data platform, consolidating fragmented monitoring, or redesigning controls after recurring data incidents. Do not use as a substitute for source-system application observability.

## Inputs
- Data platform topology
- Pipeline inventory
- Warehouses, lakes, streams, and orchestration systems
- Consumer SLAs/SLOs
- Existing metrics, logs, lineage, and quality checks

## Preconditions
Access to architecture metadata and representative operational telemetry. Critical datasets and owners should be identifiable.

## Context to inspect
Inspect ingestion paths, transformations, storage layers, orchestration, data contracts, downstream consumers, failure history, and existing alert ownership before introducing tooling.

## Core knowledge
Data observability differs from infrastructure monitoring: a healthy job can still produce wrong, late, partial, or semantically invalid data. Senior design must connect technical signals to data-product expectations while controlling telemetry cost and cardinality.

## Procedure
1. Inventory critical data products and dependencies.
2. Classify failure modes by freshness, volume, schema, quality, lineage, and execution health.
3. Define telemetry producers at source, pipeline, storage, and serving layers.
4. Establish consistent dataset and pipeline identifiers.
5. Decide which signals require metrics, logs, events, traces, or metadata snapshots.
6. Define SLO-oriented aggregation and retention.
7. Route signals to dashboards, alerting, and incident workflows.
8. Add ownership and lineage context to every actionable alert.
9. Validate behavior with injected failures.
10. Document operating boundaries and costs.

## Decision points
Prefer centralized standards with decentralized ownership. Use real-time telemetry for high-impact streaming paths; use scheduled checks when latency tolerance is high. Avoid collecting high-cardinality dimensions without a clear diagnostic use.

## Common failure patterns
- Monitoring jobs but not resulting data
- Alerts without dataset ownership
- No distinction between source delay and pipeline delay
- Excessive noisy checks
- Missing lineage context

## Verification
Prove that representative late, missing, malformed, and schema-breaking inputs produce diagnosable signals and route to the correct owner.

## Expected output
A documented observability architecture, signal taxonomy, ownership model, and validated alerting path.

## Stop conditions
Stop when critical ownership is unknown, required telemetry cannot be accessed, or introducing instrumentation would violate security or privacy controls.