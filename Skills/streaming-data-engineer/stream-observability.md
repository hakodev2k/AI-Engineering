# Stream Observability

## Purpose
Make streaming health, correctness, latency, and failure progression diagnosable from telemetry.

## When to use
Use when instrumenting pipelines, defining SLOs, or improving incident diagnosis.

## Inputs
Topology, SLOs, broker/processor metrics, logs, tracing support, business correctness signals.

## Context to inspect
Consumer lag, event age, throughput, error/retry/DLQ rates, checkpoint metrics, partition skew, sink latency.

## Core knowledge
Lag alone is insufficient. Observe event age, processing latency, throughput, errors, saturation, state/checkpoint health, and business-level completeness. High-cardinality labels require discipline.

## Procedure
1. Define user-visible streaming SLOs.
2. Instrument ingress, processing, and egress rates.
3. Track lag and oldest-event age.
4. Track errors, retries, DLQ, late events, and dropped records.
5. Track state/checkpoint and resource health.
6. Correlate events with trace/correlation identifiers where practical.
7. Build topology-aware dashboards.
8. Alert on symptoms with actionable runbooks.

## Decision points
Page on user-impacting or rapidly exhausting conditions; ticket slow trends. Sample traces while preserving critical error evidence.

## Common failure patterns
Alerting on every metric; no event-age signal; logs without event identity; cardinality explosions; dashboards disconnected from SLOs.

## Verification
Synthetic faults produce expected telemetry and alerts, and responders can localize the failing stage.

## Expected output
Metrics/tracing/logging specification, dashboards, alerts, and runbooks.

## Stop conditions
Stop if SLO ownership or telemetry access is unavailable.