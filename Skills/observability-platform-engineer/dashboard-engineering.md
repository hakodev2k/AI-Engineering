# Dashboard Engineering

## Purpose
Build operational dashboards that accelerate diagnosis, reveal service health, and support decisions without becoming collections of vanity charts.

## When to use
Use when designing service overviews, incident dashboards, platform scorecards, or replacing fragmented dashboards.

## Inputs
SLOs, service topology, common incidents, telemetry queries, audience needs.

## Context to inspect
Inspect existing panels, query cost, refresh intervals, ownership, variable usage, and incident feedback.

## Core knowledge
Understand golden signals, RED/USE methods, aggregation, percentiles, comparison windows, drill-down, and visual density.

## Procedure
1. Define the dashboard audience and decisions supported.
2. Put user-impact and SLO state first.
3. Add traffic, errors, latency, saturation, and dependency context as relevant.
4. Use consistent units, legends, and time ranges.
5. Link panels to traces, logs, and deeper diagnostic views.
6. Keep expensive queries bounded and reusable.
7. Test the dashboard against known incidents.
8. Assign ownership and retirement criteria.

## Decision points
Create separate executive, service-owner, and incident views when audiences require different abstraction levels. Prefer fewer diagnostic panels over broad metric inventories.

## Common failure patterns
Too many panels, averages hiding tails, misleading axes, undocumented transformations, expensive wildcard queries, and dashboards with no owner.

## Verification
Use historical incident windows to confirm the dashboard reveals impact, onset, scope, and likely dependencies quickly.

## Expected output
A focused dashboard with clear operational purpose and validated drill-down paths.

## Stop conditions
Stop if the dashboard has no defined audience, decision, or trustworthy data source.