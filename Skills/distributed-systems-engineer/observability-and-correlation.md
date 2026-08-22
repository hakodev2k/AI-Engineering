# Observability and Correlation

## Purpose
Make distributed requests and asynchronous workflows diagnosable across service, queue, storage, and infrastructure boundaries.

## When to use
Use for production services, distributed workflows, incident investigation, and reliability improvements.

## Inputs
Architecture, telemetry stack, SLOs, request/message contracts, and known failure modes.

## Context to inspect
Inspect logs, metrics, traces, correlation IDs, propagation headers, message metadata, dashboards, sampling, and retention.

## Core knowledge
Logs explain discrete events, metrics expose aggregate behavior, and traces show causal request paths. Correlation must propagate across synchronous and asynchronous boundaries without leaking sensitive data.

## Procedure
1. Define critical user/business journeys.
2. Identify boundaries where context must propagate.
3. Adopt standard trace/correlation propagation where available.
4. Add structured logs with stable event fields.
5. Instrument latency, errors, saturation, queue lag, retries, and dependency calls.
6. Record business workflow identifiers when safe.
7. Define sampling that preserves errors and representative traces.
8. Build journey-oriented dashboards and alerts.
9. Test telemetry during failure and high load.
10. Document investigation paths.

## Decision points
Prefer high-cardinality identifiers in traces/logs rather than metric labels. Sample high-volume success telemetry while retaining sufficient diagnostic evidence.

## Common failure patterns
Random unstructured logs, correlation lost at queues, sensitive payload logging, metrics with unbounded labels, and dashboards without actionable thresholds.

## Verification
Trace a request through all expected components, reproduce an asynchronous failure, and confirm an engineer can locate cause using production-safe telemetry.

## Expected output
A coherent telemetry model with propagation, dashboards, alerts, and diagnostic guidance.

## Stop conditions
Escalate when required telemetry would expose regulated or sensitive data without an approved handling strategy.