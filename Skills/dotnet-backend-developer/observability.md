# Observability

## Purpose
Instrument .NET backend services so engineers can detect, localize, and explain failures and performance regressions in production.

## When to use
New services/endpoints, incident follow-up, poor diagnosability, SLO monitoring, or distributed workflows.

## Inputs
Architecture, critical user journeys, telemetry stack, privacy constraints, SLOs.

## Context to inspect
Logging configuration, metrics, traces, correlation IDs, health checks, dashboards, sampling, sensitive fields.

## Core knowledge
Logs explain discrete events, metrics expose trends/alerts, traces show request causality. High-cardinality dimensions and sensitive data require control.

## Procedure
1. Define critical operations and failure signals.
2. Emit structured logs with stable event fields.
3. Add latency/throughput/error metrics.
4. Propagate distributed trace context.
5. Instrument external dependencies.
6. Add health/readiness checks reflecting actual service ability.
7. Control sampling and cardinality.
8. Redact secrets/PII.
9. Build dashboards/alerts tied to user impact.
10. Validate telemetry during failure tests.

## Decision points
Prefer metrics for alerting and logs/traces for diagnosis. Add custom telemetry only when framework/runtime signals are insufficient.

## Common failure patterns
Logging everything, string-only logs, no correlation, alerting on noisy technical symptoms, high-cardinality labels, secrets in logs.

## Verification
Trace a representative request end-to-end, trigger a controlled failure, verify alerts and diagnostic evidence.

## Expected output
Actionable telemetry with controlled cost and privacy risk.

## Stop conditions
Escalate telemetry retention/export changes involving compliance or regulated data.