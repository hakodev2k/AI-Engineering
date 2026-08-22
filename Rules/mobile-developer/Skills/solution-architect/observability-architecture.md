# Observability Architecture

## Purpose
Design telemetry so operators can understand health, diagnose failures, measure SLOs, and trace distributed behavior efficiently.

## When to use
Use for production systems, distributed architectures, reliability programs, and incident-prone integrations.

## Inputs
Critical journeys, SLOs, architecture topology, failure modes, support model, compliance constraints.

## Preconditions
Operational questions and ownership are known.

## Context to inspect
Logs, metrics, traces, correlation IDs, dashboards, alerts, retention, sampling, PII handling, platform telemetry, cost.

## Core knowledge
Telemetry exists to answer operational questions. High-cardinality metrics and unbounded logs can be expensive. Distributed tracing requires context propagation across boundaries.

## Procedure
1. Define critical service-level indicators.
2. Identify operational questions for common failure modes.
3. Standardize structured logging and correlation.
4. Define metrics for traffic, errors, latency, saturation, queues, and business outcomes.
5. Add tracing across important distributed paths.
6. Define ownership metadata and deployment version tags.
7. Design dashboards around SLOs and user journeys.
8. Create actionable alerts tied to symptoms, not noise.
9. Define retention, sampling, access, and privacy controls.
10. Test observability during controlled failures.

## Decision points
Prefer metrics for alerting, traces for distributed diagnosis, and logs for detailed evidence. Sample intelligently rather than collecting everything forever.

## Common failure patterns
Log-only observability, no correlation, alerts on CPU without user impact, missing dependency metrics, PII leakage, unusable dashboard sprawl.

## Verification
Operators can diagnose representative failures from telemetry without reproducing them locally.

## Expected output
Telemetry standards, SLO dashboards, alert model, and trace strategy.

## Stop conditions
Stop when data-handling policies prohibit required telemetry without an approved alternative.