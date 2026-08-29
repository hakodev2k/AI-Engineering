# Observability and Operability

## Purpose
Ensure a proposed solution can be monitored, diagnosed, supported, and operated effectively after deployment.

## When to use
Use during architecture, POC exit review, production-readiness review, and incident remediation.

## Inputs
Architecture, SLOs, telemetry capabilities, support model, runbooks, incident history.

## Context to inspect
Logs, metrics, traces, audit events, health endpoints, dashboards, alerts, retention, correlation identifiers, and ownership.

## Core knowledge
Telemetry must answer operational questions. More data is not automatically more observability; cardinality, cost, privacy, signal quality, and actionable alerting matter.

## Procedure
1. Identify critical user journeys and failure modes.
2. Define service-level indicators.
3. Map required logs, metrics, traces, and audit evidence.
4. Ensure cross-system correlation.
5. Design actionable alerts around symptoms and risk.
6. Define dashboards and diagnostic workflows.
7. Establish retention and access controls.
8. Test diagnosis using injected or historical failures.

## Decision points
Prefer metrics for aggregate trends, traces for distributed causality, and logs for detailed events; combine them around operational questions.

## Common failure patterns
Logging secrets, alerting on every error, missing correlation IDs, dashboards without decisions, and telemetry unavailable during failure.

## Verification
Operators can detect, scope, and diagnose representative failures from available telemetry.

## Expected output
An operability plan with signals, alerts, dashboards, and ownership.

## Stop conditions
Stop when required telemetry is unsupported or privacy/security constraints are unresolved.