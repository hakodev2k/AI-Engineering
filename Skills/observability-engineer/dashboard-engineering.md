# Dashboard Engineering

## Purpose
Build operational dashboards that support rapid health assessment, diagnosis, and capacity decisions.

## When to use
Use for service ownership, incident response, release monitoring, or SLO review.

## Inputs
Service architecture, SLOs, telemetry queries, dependencies, deployment metadata, and audience needs.

## Context to inspect
Inspect existing dashboards, common incident questions, signal quality, query cost, time ranges, and variable cardinality.

## Core knowledge
Dashboards should tell a coherent operational story. Overview views answer whether users are affected; drill-down views explain where and why. Visualizations must preserve distributions and units accurately.

## Procedure
1. Define dashboard audience and decisions.
2. Put user-impact and SLO status first.
3. Add traffic, errors, latency, saturation, and backlog as relevant.
4. Add dependency and deployment context.
5. Provide useful filters without unbounded variables.
6. Link panels to traces or logs for drill-down.
7. Validate time zones, units, aggregation, and missing-data behavior.
8. Test during a realistic incident.

## Decision points
Use percentiles or histograms for latency, rates for counters, and absolute gauges only when state is meaningful. Separate executive, service, and deep-diagnostic views when audiences differ.

## Common failure patterns
Wall-of-charts dashboards, misleading averages, unlabeled units, decorative panels, slow queries, and no path from symptom to evidence.

## Verification
Ask an unfamiliar responder to diagnose a staged failure using the dashboard and record unanswered questions.

## Expected output
Focused dashboards with clear hierarchy, trustworthy queries, and diagnostic drill-down.

## Stop conditions
Stop when underlying telemetry is unreliable; fix signal quality before polishing visualization.