# LLM Request Tracing

## Purpose
Establish end-to-end tracing for AI requests so engineers can reconstruct latency, routing, retrieval, tool, model, and post-processing behavior without exposing sensitive content.

## When to use
Use when instrumenting an LLM application, diagnosing intermittent latency, or standardizing telemetry across AI services. Do not capture raw prompts by default.

## Inputs
Application topology, model/provider calls, trace SDK, privacy rules, sampling policy, and representative requests.

## Context to inspect
Inspect existing trace propagation, async boundaries, retries, gateways, retrieval/tool calls, background work, and current telemetry conventions.

## Core knowledge
A useful trace preserves causality across service boundaries. Spans should describe stable operations and carry low-cardinality attributes such as model, provider, region, outcome, token counts, and retry number. Prompt or response bodies are sensitive data, not routine span attributes.

## Procedure
1. Map the full request path and identify observability boundaries.
2. Define a canonical trace/span taxonomy for orchestration, retrieval, tool execution, model calls, validation, and response delivery.
3. Propagate trace context across HTTP, queues, workers, and async tasks.
4. Record model/provider identifiers, latency, token usage, outcome, cache status, and retry metadata.
5. Redact or hash user identifiers and content according to policy.
6. Add exception and timeout events without duplicating large payloads.
7. Configure head or tail sampling based on traffic and diagnostic value.
8. Test successful, failed, retried, and cancelled flows.
9. Document how responders navigate from an alert to a representative trace.

## Decision points
Use tail sampling when rare slow/error traces matter more than uniform traffic representation. Store content only when an approved debugging workflow requires it; prefer derived metadata otherwise.

## Common failure patterns
Broken context propagation, high-cardinality attributes, raw prompt leakage, spans that merely mirror functions, missing retries, and traces that stop at queue boundaries.

## Verification
Generate controlled requests and prove that one trace reconstructs the complete path, timestamps align, errors are attributable, and sensitive fields are absent.

## Expected output
A stable trace model, instrumentation changes, sampling policy, and evidence from representative traces.

## Stop conditions
Stop if privacy requirements are unclear, provider telemetry cannot be correlated safely, or instrumentation requires production data access beyond authorization.