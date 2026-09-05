# Observability and Route Attribution

## Purpose
Make every routing decision observable and explainable enough to debug quality, latency, cost, policy, and capacity problems in production.

## When to use
Use when building or reviewing an AI gateway, investigating inconsistent model behavior, or operating multi-model traffic at scale.

## Inputs
Request metadata, router decision data, model/provider identifiers, policy version, latency, token usage, errors, fallback history, and evaluation outcomes.

## Preconditions
Telemetry must follow privacy and data-minimization requirements. Sensitive prompt or output content should not be logged by default.

## Context to inspect
Tracing, metrics, structured logs, correlation IDs, model gateway, experiment assignment, fallback chain, provider responses, and dashboards.

## Core knowledge
Without route attribution, downstream quality or cost regressions cannot be tied reliably to model, provider, policy, or fallback decisions. Observability should capture decision metadata rather than indiscriminately storing user content.

## Procedure
1. Assign a correlation ID across gateway and downstream calls.
2. Record request class and policy version.
3. Record candidate eligibility outcomes and final route reason.
4. Capture immutable model/provider/deployment identifiers.
5. Record fallback attempts and failure reasons.
6. Emit input/output token counts and latency components.
7. Track quota, cache, and circuit-breaker effects.
8. Add quality or safety outcome linkage when available.
9. Build route-level and segment-level dashboards.
10. Define retention, sampling, and redaction rules.

## Decision points
Log decision evidence, not raw sensitive content, unless an approved debugging workflow requires it. Use sampling only when rare critical route failures remain detectable.

## Common failure patterns
Logging only the final model name, losing fallback history, mutable aliases without version IDs, high-cardinality labels that break metrics, and missing tenant/request-class dimensions.

## Verification
Trace representative requests end to end and confirm an operator can explain why each route was selected and what happened after selection.

## Expected output
An observability schema, route dashboards, correlation strategy, and alert-ready metrics.

## Stop conditions
Stop if required telemetry would violate privacy or compliance rules without an approved alternative.