# API Observability

## Purpose
Make API behavior diagnosable through coherent metrics, logs, traces, and correlation.

## When to use
Use when onboarding APIs, defining platform telemetry, troubleshooting incidents, or establishing SLOs.

## Inputs
API topology, telemetry stack, SLOs, privacy rules, incident patterns.

## Context to inspect
Inspect gateway/service telemetry, trace propagation, log fields, cardinality, dashboards, sampling, and alerting.

## Core knowledge
Useful API observability connects consumer, route, upstream, status class, latency, and trace context while controlling cardinality and sensitive data. RED metrics—rate, errors, duration—form a strong baseline.

## Procedure
1. Define service and route identity conventions.
2. Instrument request rate, errors, and latency distributions.
3. Propagate standard trace context end to end.
4. Emit structured logs with correlation identifiers.
5. Record dependency latency and failure dimensions.
6. Exclude secrets and sensitive payloads.
7. Define sampling appropriate to traffic and incident needs.
8. Build SLO-oriented dashboards and alerts.
9. Validate telemetry during synthetic failures.
10. Periodically audit usefulness and cardinality cost.

## Decision points
Prefer metrics for aggregate health, traces for request paths, and logs for detailed events. Increase sampling selectively rather than indiscriminately logging payloads.

## Common failure patterns
High-cardinality labels, missing correlation, alerting on raw error counts, sensitive payload logging, and telemetry gaps between gateway and service.

## Verification
Trace representative requests end-to-end and confirm dashboards expose latency, errors, dependencies, and consumer impact.

## Expected output
Operational telemetry that supports rapid diagnosis and SLO management.

## Stop conditions
Stop if privacy requirements prohibit proposed telemetry or platform identifiers cannot be correlated safely.