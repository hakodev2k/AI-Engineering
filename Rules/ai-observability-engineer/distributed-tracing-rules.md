# Distributed Tracing Rules

## Purpose
Ensure AI request flows are traceable across model providers, retrieval systems, tools, queues, and application services.

## Scope
Applies to trace/span creation, propagation, attributes, sampling, and cross-service correlation.

## MUST
- Every externally initiated AI request MUST create or join a trace with consistent context propagation.
- Model calls, retrieval operations, tool calls, external APIs, and asynchronous boundaries MUST create child spans or equivalent correlated records.
- Spans MUST record operation type, outcome, latency, dependency identity, and non-sensitive identifiers needed for diagnosis.
- Trace propagation across queues and background jobs MUST preserve causality.
- Sampling policy MUST preserve enough error and high-latency traces for incident investigation.

## MUST NOT
- Trace attributes MUST NOT contain secrets, raw authentication tokens, or unrestricted sensitive prompt content.
- Missing instrumentation MUST NOT be hidden by synthetic success spans.
- Parent-child relationships MUST NOT be fabricated when actual causality is unknown.

## SHOULD
- Capture retry attempts and fallback paths as separate spans.
- Preserve exemplars linking key metrics to representative traces where supported.

## Exceptions
Reduced tracing is acceptable only with documented privacy, cost, or platform constraints and an alternate diagnostic mechanism.

## Verification
Run end-to-end trace tests, inspect async propagation, force provider and tool failures, and confirm investigators can follow the complete causal path without relying on timestamps alone.