# Production Observability Instrumentation

## Purpose
Instrument AI releases so operators can attribute quality, safety, reliability, latency, and cost behavior to exact model and configuration versions.

## When to use
Use before production promotion or when existing telemetry cannot support release decisions and incident diagnosis.

## Inputs
SLOs, risk taxonomy, serving architecture, model metadata, logging/privacy policy, and monitoring platform.

## Preconditions
Telemetry destinations and data-retention constraints are known.

## Context to inspect
Inspect request lifecycle, model gateway, tool calls, retrieval, streaming, retries, caches, provider responses, and version propagation.

## Core knowledge
AI observability needs infrastructure and behavior signals. High-cardinality version identifiers are valuable but must be managed. Raw prompts and outputs may contain sensitive data and should not be logged by default.

## Procedure
1. Define release questions telemetry must answer.
2. Propagate immutable model/config version identifiers end to end.
3. Capture latency stages, token usage, errors, retries, routing, and resource metrics.
4. Add privacy-safe quality and safety indicators.
5. Trace retrieval and tool-call dependencies where relevant.
6. Define dashboards by candidate, baseline, slice, region, and consumer.
7. Configure actionable alerts tied to rollback criteria.
8. Validate sampling and retention preserve diagnostic value.
9. Test telemetry during controlled failure scenarios.

## Decision points
Use sampled traces for expensive high-volume detail; use aggregate metrics for continuous SLO monitoring. Capture raw content only with explicit authorization and minimization controls.

## Common failure patterns
No version labels, logging sensitive content, dashboards with averages only, alerts without owners, missing retry attribution, and telemetry arriving too late for safe canaries.

## Verification
Send known test requests and confirm end-to-end version attribution, metric accuracy, trace continuity, alert firing, and privacy controls.

## Expected output
A verified observability package supporting release monitoring and incident response.

## Stop conditions
Stop if critical release metrics cannot be attributed, telemetry violates privacy constraints, or rollback alerts cannot be made actionable.
