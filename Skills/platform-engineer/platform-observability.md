# Platform Observability

## Purpose
Make platform health, dependency behavior, and user-impacting failures diagnosable.

## When to use
Use for shared platform services, control planes, pipelines, and runtime infrastructure.

## Inputs
Architecture, SLOs, request flows, dependencies, incidents, and telemetry systems.

## Context to inspect
Logs, metrics, traces, audit events, dashboards, alert rules, correlation IDs, and retention.

## Core knowledge
Observe user journeys and control-plane state, not just host health. Telemetry must support detection, diagnosis, and capacity decisions.

## Procedure
1. Define critical platform journeys.
2. Establish SLIs for availability, latency, errors, and saturation.
3. Instrument boundaries with structured logs and traces.
4. Add dependency and queue telemetry.
5. Build dashboards around SLOs and failure domains.
6. Alert on actionable symptoms.
7. Test correlation from user error to root cause.
8. Review telemetry gaps after incidents.

## Decision points
Prefer symptom alerts over low-level noise; add high-cardinality telemetry only where diagnostic value justifies cost.

## Common failure patterns
Dashboard-only observability, unbounded labels, missing correlation, alerts without owners, and logs containing secrets.

## Verification
Inject representative failures and confirm operators can detect, localize, and explain them within target time.

## Expected output
An observable platform with SLIs, instrumentation, dashboards, alerts, and diagnostic guidance.

## Stop conditions
Escalate when critical journeys cannot be measured or telemetry exposes sensitive data.