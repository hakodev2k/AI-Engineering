# Observability Architecture

## Purpose
Design software so operators can understand system state, diagnose failures, and correlate behavior across components.

## When to use
Use for production systems, distributed workflows, incident-prone applications, or when logs/metrics cannot explain failures.

## Inputs
System topology, critical journeys, SLOs, incident history, logging and tracing stack, data sensitivity constraints.

## Context to inspect
Logs, metrics, traces, correlation IDs, dashboards, alert rules, telemetry cost, sampling, and ownership.

## Core knowledge
Logs explain discrete events, metrics quantify trends, and traces connect distributed work. Useful observability starts from operational questions and business-critical journeys, not from collecting everything.

## Procedure
1. Identify critical user and system journeys.
2. Define signals needed to answer health and failure questions.
3. Standardize structured logging fields and correlation IDs.
4. Instrument latency, throughput, errors, saturation, and business outcomes.
5. Add distributed traces at meaningful boundaries.
6. Define dashboards and alerts around actionable symptoms.
7. Redact or avoid sensitive telemetry.
8. Set retention, sampling, and cost controls.
9. Validate telemetry during representative failures.

## Decision points
Use high-cardinality traces/logs for diagnosis and metrics for alerting/trends. Sample only when losing detail does not hide critical failures.

## Common failure patterns
Unstructured logs, no correlation, alerting on implementation noise, sensitive data leakage, missing business metrics, and dashboards nobody owns.

## Verification
Trigger known success and failure scenarios and confirm operators can identify affected component, request path, root symptom, and impact.

## Expected output
An observability design with standardized telemetry, actionable dashboards, alerts, and diagnostic coverage.

## Stop conditions
Stop when telemetry requirements conflict with privacy/compliance rules without approved handling.