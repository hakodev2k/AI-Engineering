# Cloud Observability

## Purpose
Build actionable visibility across applications, managed services, infrastructure, and cloud control planes.

## When to use
Use for production readiness, troubleshooting, SLO implementation, migrations, and incident reduction.

## Inputs
Service topology, critical journeys, SLOs, telemetry sources, retention and privacy requirements.

## Context to inspect
Metrics, logs, traces, audit events, dashboards, alerts, correlation identifiers, telemetry costs.

## Core knowledge
Observability should answer user-impact and causal questions. Collect signals deliberately; high-volume telemetry without queries, ownership, or retention discipline becomes expensive noise.

## Procedure
1. Identify critical user and system outcomes.
2. Define SLIs for latency, traffic, errors, saturation, and business-critical flows.
3. Instrument distributed traces and correlation.
4. Centralize structured logs and cloud audit events.
5. Build dependency-aware dashboards.
6. Alert on actionable symptoms and SLO burn.
7. Define retention and sensitive-data controls.
8. Tune sampling and cardinality.
9. Link alerts to runbooks and owners.
10. Validate during controlled failures.

## Decision points
Retain detailed telemetry where diagnostic value justifies cost; aggregate or sample high-volume low-value signals.

## Common failure patterns
Alerting every metric, unbounded labels, missing request correlation, secrets in logs, dashboards without owners, and monitoring only compute.

## Verification
Simulate known failures and confirm operators can detect, scope, and diagnose them from telemetry.

## Expected output
An actionable observability system tied to service objectives.

## Stop conditions
Escalate telemetry containing regulated data or monitoring gaps caused by inaccessible dependencies.