# AI Dashboard Design

## Purpose
Build operational dashboards that let engineers move from user impact to likely AI-system causes quickly.

## When to use
Use when creating or restructuring AI production dashboards, on-call views, or release health views.

## Inputs
SLOs, metric catalog, traces, incident history, service topology, model/provider dimensions, and stakeholder needs.

## Context to inspect
Inspect existing dashboards, common incident questions, cardinality limits, deployment markers, and links to traces/logs/runbooks.

## Core knowledge
Dashboards should support progressive diagnosis: user impact, service health, AI-specific behavior, dependencies, and exemplars. Dense collections of unrelated charts slow responders.

## Procedure
1. Define the dashboard audience and decisions it must support.
2. Put SLO/error-budget and end-to-end traffic/error/latency at the top.
3. Add TTFT, generation latency, tokens, cost, retries, fallback, and provider health.
4. Add retrieval/tool/agent panels only where relevant to the system.
5. Include saturation and quota indicators.
6. Provide filters for bounded dimensions such as model, provider, region, route, and config version.
7. Add deployment/configuration annotations.
8. Link panels to representative traces and runbooks.
9. Validate the dashboard against past incident timelines.

## Decision points
Create separate specialist dashboards when one view becomes too dense. Use percentiles/distributions rather than averages for latency.

## Common failure patterns
Vanity charts, no denominators, excessive panels, inconsistent time ranges, missing version markers, and dashboards that cannot pivot to traces.

## Verification
Run a tabletop exercise using a historical incident and confirm a responder can identify impact, cohort, and likely failing stage without ad hoc queries.

## Expected output
A layered operational dashboard with clear semantics, filters, annotations, and diagnostic links.

## Stop conditions
Stop if underlying metric definitions are ambiguous; fix telemetry semantics before polishing visualization.