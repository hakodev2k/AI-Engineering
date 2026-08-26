# Data Quality Observability

## Purpose
Build operational visibility that connects quality signals to datasets, pipelines, owners, consumers, and incidents.

## When to use
Use when quality failures are discovered late, alerts lack context, or teams need production health visibility for data products.

## Inputs
Quality metrics, lineage, pipeline telemetry, freshness, volumes, contracts, incidents, ownership, and SLOs.

## Preconditions
Metrics must have stable definitions and actionable ownership.

## Context to inspect
Review existing dashboards, alert rules, logs, traces, orchestration events, catalog metadata, incident response, and consumer SLOs.

## Core knowledge
Observability should answer what changed, where, when, who is affected, and what to do next. More telemetry is not automatically better; high-cardinality and payload capture create cost and privacy risks.

## Procedure
1. Define critical health questions by data product.
2. Instrument freshness, volume, schema, rule failures, and pipeline state.
3. Correlate signals with deployment and upstream changes.
4. Attach ownership and lineage context.
5. Build product-level health views rather than isolated test dashboards.
6. Define symptom alerts around consumer impact.
7. Include diagnostic links and runbooks.
8. Measure alert precision and time-to-detection.
9. Retain enough history for baselines and incident analysis.
10. Review telemetry cost and sensitive-data exposure.

## Decision points
Prefer metrics over raw payload logging. Page on urgent actionable impact; ticket lower-severity drift. Centralize common telemetry while preserving domain-specific semantics.

## Common failure patterns
Dashboard-only observability; alert storms; no owner metadata; storing sensitive rows in logs; metrics without event-time context; separate quality and pipeline alerts that cannot be correlated.

## Verification
Simulated failures appear in the correct product view, route to the correct owner, include enough context for diagnosis, and recover cleanly after resolution.

## Expected output
An actionable observability model with metrics, dashboards, alerts, ownership, lineage context, retention, and runbooks.

## Stop conditions
Stop instrumentation that would expose protected data, create uncontrolled cost, or generate alerts with no response owner.