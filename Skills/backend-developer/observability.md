# Backend Observability

## Purpose
Instrument services so operators can detect, localize, and explain failures and performance regressions.

## When to use
Use for new services/endpoints, production-readiness reviews, incident follow-up, or blind spots in diagnosis.

## Inputs
Service objectives, architecture, critical flows, incident history, telemetry platform, privacy constraints.

## Context to inspect
Logs, metrics, traces, correlation IDs, dashboards, alerts, health checks, dependency telemetry, and sampling configuration.

## Core knowledge
Structured logging, RED/USE signals, distributed tracing, cardinality, sampling, correlation, SLIs/SLOs, alert quality, and sensitive-data handling.

## Procedure
1. Identify critical user/system outcomes.
2. Define measurable SLIs for latency, errors, throughput, and saturation.
3. Add structured events with stable fields and correlation.
4. Trace cross-process critical paths.
5. Instrument dependency latency and failure classes.
6. Avoid high-cardinality labels and sensitive payloads.
7. Build dashboards around diagnosis questions.
8. Alert on actionable symptoms rather than noisy causes.
9. Validate telemetry during controlled failures.

## Decision points
Use logs for discrete context, metrics for trends/alerts, and traces for request-path causality. Sample high-volume traces while preserving errors and representative tails.

## Common failure patterns
Unstructured logs, secret/PII leakage, dashboards without decisions, alert floods, missing dependency context, and metrics with explosive cardinality.

## Verification
Trigger known success/failure scenarios and confirm an operator can identify scope, cause candidates, and affected dependencies from telemetry.

## Expected output
Operationally useful telemetry, dashboards, and alerts tied to service behavior.

## Stop conditions
Stop when telemetry collection violates privacy/security requirements or production observability changes require platform approval.