# Event-Driven Observability

## Purpose
Make asynchronous workflows diagnosable across producers, brokers, consumers, retries, and derived state.

## When to use
Use when designing telemetry, troubleshooting latency, or defining production readiness.

## Inputs
Workflow topology, SLOs, telemetry stack, event metadata, broker metrics.

## Context to inspect
Current logs, traces, correlation IDs, consumer lag, DLQs, retry metrics, dashboards, and alert ownership.

## Core knowledge
Asynchronous latency includes queue time plus processing time. Correlation, causation, event IDs, partition/offset, attempt count, and consumer identity enable reconstruction. High-cardinality fields require deliberate metric design.

## Procedure
1. Define user/business outcomes and SLOs.
2. Propagate trace/correlation and causation metadata.
3. Emit structured producer and consumer logs without sensitive payload leakage.
4. Measure publish failures, throughput, lag, age-of-oldest, processing latency, retries, and DLQ rate.
5. Trace broker boundaries using supported semantic conventions.
6. Build workflow-centric dashboards.
7. Alert on sustained business-impacting symptoms rather than noise.
8. Link alerts to runbooks.
9. Validate telemetry during fault tests.

## Decision points
Use metrics for trends/alerts, traces for cross-service causality, and logs for detailed evidence. Sample traces carefully without losing rare failures.

## Common failure patterns
Logging full payloads, no correlation metadata, monitoring only broker uptime, alerting on every retry, and confusing consumer lag with processing duration.

## Verification
Operators can trace a representative event end to end and identify backlog, failure stage, retry history, and business impact.

## Expected output
Dashboards, alerts, trace/log conventions, and runbook-linked telemetry.

## Stop conditions
Stop if telemetry would expose regulated data or identifiers lack an approved handling policy.