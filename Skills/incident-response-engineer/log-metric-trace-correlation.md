# Log Metric Trace Correlation

## Purpose
Correlate logs, metrics, traces, and events to reconstruct failure behavior across distributed systems.

## When to use
Use when symptoms span services, telemetry sources disagree, or a request path must be reconstructed.

## Inputs
Logs, metrics, distributed traces, correlation IDs, deployment events, infrastructure events, and synchronized timestamps.

## Context to inspect
Inspect sampling, retention, clock skew, cardinality dimensions, telemetry gaps, trace propagation, and environment boundaries.

## Core knowledge
Each telemetry type answers different questions: metrics show aggregate behavior, traces show causal request paths, logs provide detailed events, and change events explain environmental transitions. Missing telemetry is itself a constraint, not proof of absence.

## Procedure
1. Normalize the incident time window and time zones.
2. Start with a high-signal symptom metric or request example.
3. Identify correlation, trace, tenant, host, or operation identifiers.
4. Follow traces across service boundaries.
5. Compare error and latency metrics at each hop.
6. Inspect relevant logs around trace timestamps.
7. Overlay deployments, configuration, autoscaling, and dependency events.
8. Compare affected paths with healthy control paths.
9. Document telemetry gaps and confidence limits.
10. Preserve queries needed for later verification.

## Decision points
Use aggregate metrics to bound scope and traces/logs to explain individual failures. Increase sampling cautiously when diagnostic value exceeds cost and privacy risk.

## Common failure patterns
Searching logs without a time boundary, ignoring clock skew, assuming sampled traces represent all traffic, high-cardinality query overload, and reading telemetry sources independently.

## Verification
Confirm the reconstructed sequence is temporally consistent and supported by multiple telemetry types where possible.

## Expected output
A correlated failure timeline linking symptoms, requests, components, changes, and evidence queries.

## Stop conditions
Escalate when telemetry access is restricted, retention has expired, or increasing telemetry could expose sensitive data or destabilize production.