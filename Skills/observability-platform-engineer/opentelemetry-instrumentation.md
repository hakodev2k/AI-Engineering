# OpenTelemetry Instrumentation

## Purpose
Implement production-grade telemetry instrumentation using OpenTelemetry while preserving semantic consistency and acceptable runtime overhead.

## When to use
Use when instrumenting services, standardizing telemetry across languages, or migrating vendor-specific agents to OpenTelemetry.

## Inputs
- Service code and runtime
- Existing instrumentation
- Critical operations and dependencies
- Telemetry backend requirements

## Context to inspect
Inspect framework auto-instrumentation, custom spans, metric names, resource attributes, baggage, context propagation, and current exporters.

## Core knowledge
Understand traces, spans, metrics, logs, context propagation, semantic conventions, resource attributes, instrumentation libraries, SDK configuration, and exporter behavior.

## Procedure
1. Identify critical request, job, and dependency boundaries.
2. Enable supported auto-instrumentation first.
3. Add custom spans only where business or diagnostic context is missing.
4. Apply stable semantic attributes with bounded cardinality.
5. Propagate trace context through HTTP, messaging, and async boundaries.
6. Define metric instruments according to measurement semantics.
7. Configure batching, sampling, limits, and exporters.
8. Scrub or exclude sensitive data.
9. Measure instrumentation overhead.
10. Validate telemetry continuity across distributed flows.

## Decision points
Prefer auto-instrumentation for coverage and maintenance; use manual instrumentation for domain-significant operations. Use baggage sparingly because it propagates across boundaries.

## Common failure patterns
- High-cardinality span attributes
- Broken async context propagation
- Duplicate metrics from auto and manual instrumentation
- Capturing secrets or personal data
- Excessive span creation in hot loops

## Verification
Trace representative transactions end-to-end, inspect metric dimensions, test failure paths, and benchmark CPU, memory, and latency overhead.

## Expected output
Consistent OpenTelemetry instrumentation with documented conventions and verified overhead.

## Stop conditions
Stop if sensitive-data policy, required propagation boundaries, or backend compatibility is unresolved.