# Observability

## Purpose
Make full-stack systems diagnosable through correlated logs, metrics, traces, and user-facing telemetry.

## When to use
Production readiness, new critical flows, incident follow-up, or systems with poor diagnostic evidence.

## Inputs
Architecture, critical journeys, SLOs, failure modes, telemetry platform, privacy constraints.

## Context to inspect
Logging, tracing headers, metrics, browser telemetry, dashboards, alerts, retention, sensitive fields.

## Core knowledge
Telemetry should answer what failed, where, for whom, since when, and with what impact. Correlation across client, API, workers, and dependencies is more useful than high-volume unstructured logs.

## Procedure
1. Identify critical user and service journeys.
2. Define success, latency, traffic, and error signals.
3. Propagate correlation/trace context across boundaries.
4. Emit structured logs at meaningful state transitions.
5. Add metrics for rates, latency, saturation, and queues.
6. Capture frontend errors and performance where useful.
7. Instrument external calls and database operations.
8. Redact secrets and sensitive data.
9. Build actionable dashboards and alerts.
10. Validate telemetry during controlled failures.

## Decision points
Use metrics for trends/alerts, traces for request causality, and logs for detailed events. Sample high-volume telemetry while preserving errors and rare critical paths.

## Common failure patterns
Logging everything, missing correlation, high-cardinality metric labels, secret leakage, alerts without action, and instrumentation added only after incidents.

## Verification
Trigger representative failures and confirm operators can trace impact to cause using available telemetry.

## Expected output
Correlated, privacy-aware telemetry and actionable operational views.

## Stop conditions
Escalate when required telemetry conflicts with privacy, compliance, or cost constraints.