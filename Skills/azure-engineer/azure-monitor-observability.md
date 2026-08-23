# Azure Monitor Observability

## Purpose
Build actionable Azure observability using metrics, logs, traces, dashboards, and alerts that support diagnosis rather than generate noise.

## When to use
Use when onboarding production workloads, investigating incidents, defining SLO signals, or reducing monitoring blind spots.

## Inputs
Architecture, critical user journeys, failure modes, SLOs, telemetry sources, retention needs, and responder ownership.

## Context to inspect
Inspect Azure Monitor metrics, Log Analytics workspaces, Application Insights, diagnostic settings, data collection rules, alerts, action groups, workbooks, and telemetry costs.

## Core knowledge
Metrics are efficient for trends and alerting; logs provide high-cardinality diagnostic context; distributed traces reveal cross-service latency and failures. Observability must begin with questions responders need to answer.

## Procedure
1. Identify critical services and user journeys.
2. Define health, traffic, error, latency, and saturation signals.
3. Enable required resource diagnostic settings.
4. Instrument application traces and correlation.
5. Route telemetry to appropriately scoped workspaces.
6. Define retention and sampling based on diagnostic and compliance value.
7. Create symptom-based alerts with clear ownership and runbooks.
8. Build dashboards/workbooks for operational questions.
9. Simulate failures and verify signal arrival and alert routing.
10. Review noisy, unused, and expensive telemetry regularly.

## Decision points
Prefer metrics for low-latency alerting and logs/traces for investigation. Centralize workspaces when governance and cross-resource querying dominate; separate when residency, access, ownership, or cost isolation requires it.

## Common failure patterns
Collecting everything without purpose, alerts on transient resource noise, missing correlation IDs, no diagnostic settings on dependencies, dashboards nobody owns, and ignoring ingestion cost.

## Verification
Trigger controlled failures, confirm alerts reach responders, trace requests across dependencies, execute diagnostic queries, and verify retention/access requirements.

## Expected output
An observability baseline with actionable signals, dashboards, alerts, ownership, and tested diagnostic workflows.

## Stop conditions
Stop when telemetry may expose sensitive data without an approved handling policy, or when alert ownership and response expectations are undefined.