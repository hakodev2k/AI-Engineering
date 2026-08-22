# GraphQL Observability

## Purpose
Make GraphQL behavior diagnosable at operation, resolver, dependency, and error levels without leaking sensitive query variables.

## When to use
Use when instrumenting production GraphQL services or improving incident diagnosis.

## Inputs
Telemetry platform, schema, operation naming conventions, privacy policy, SLOs, and dependency map.

## Context to inspect
Inspect logs, metrics, traces, operation names/hashes, resolver spans, error codes, query cost, DataLoader metrics, and cardinality controls.

## Core knowledge
Raw query text and variables may contain sensitive data and create high-cardinality telemetry. Prefer normalized operation identity, hashes, bounded field metadata, distributed traces, and outcome classifications.

## Procedure
1. Define service-level GraphQL SLIs.
2. Capture operation name/hash, duration, outcome, and estimated cost.
3. Trace significant resolver/downstream spans.
4. Record batch counts and sizes for loaders.
5. Classify errors with stable codes.
6. Propagate correlation and trace context downstream.
7. Redact variables and sensitive field values.
8. Control metric label cardinality.
9. Build dashboards for latency, errors, saturation, and expensive operations.
10. Validate telemetry during representative failures.

## Decision points
Trace all requests only when cost permits; otherwise use sampling that retains errors and slow traces. Instrument field-level spans selectively to avoid excessive overhead.

## Common failure patterns
Logging full queries with secrets, unbounded field labels, no operation identity, traces that stop at the GraphQL server, and dashboards based only on HTTP status.

## Verification
Trigger known failures and slow operations, then confirm telemetry identifies operation, bottleneck, dependency, and error class without exposing sensitive values.

## Expected output
Low-risk telemetry sufficient for performance and incident investigation.

## Stop conditions
Stop if observability requirements conflict with privacy or data-retention policy until approved handling is defined.