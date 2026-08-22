# Distributed Tracing

## Purpose
Instrument end-to-end request and message flows so engineers can locate latency, errors, and dependency failures across service boundaries.

## When to use
Use for distributed applications, asynchronous workflows, or incidents where component-local telemetry cannot explain the full path.

## Inputs
Service topology, protocols, messaging systems, tracing SDK, propagation standards, and sampling policy.

## Context to inspect
Inspect inbound/outbound HTTP, RPC, database calls, queues, background workers, context propagation, retries, and existing trace attributes.

## Core knowledge
A trace is a causally related span graph. Correct propagation matters more than span quantity. Span attributes should follow stable semantic conventions and avoid sensitive or unbounded values.

## Procedure
1. Map transaction boundaries.
2. Verify trace-context propagation across each boundary.
3. Instrument server, client, producer, consumer, and important internal spans.
4. Record status, duration, dependency identity, and bounded business context.
5. Link asynchronous operations correctly.
6. Configure head or tail sampling based on diagnostic goals.
7. Validate trace continuity under retries and failures.
8. Correlate traces with logs and metrics.

## Decision points
Use custom spans only for operations whose timing or causality matters. Prefer tail sampling when rare failures must be retained and the platform supports it.

## Common failure patterns
Broken propagation, span explosion, payload capture, incorrect parentage, losing async links, and sampling away all interesting failures.

## Verification
Execute known multi-service flows and confirm complete topology, accurate timings, error attribution, and cross-signal correlation.

## Expected output
Reliable distributed traces that expose causal request paths and dependency behavior.

## Stop conditions
Stop when propagation changes could break protocol compatibility or sensitive attributes cannot be safely controlled.