# Observability and Request Tracing

## Purpose
Give developers enough visibility into AI requests to diagnose latency, cost, failures, tool behavior, retrieval, and model responses across local and production environments.

## When to use
Use when designing tracing, dashboards, SDK instrumentation, request IDs, prompt/tool logs, or debugging workflows.

## Inputs
Application architecture, model providers, gateway behavior, SDK hooks, telemetry platform, privacy policy, error taxonomy, latency targets, and cost accounting.

## Context to inspect
Inspect logs, traces, metrics, correlation identifiers, redaction rules, sampling, distributed spans, token usage, retries, cache behavior, tool calls, and user-reported incidents.

## Core knowledge
AI observability must connect application, model, retrieval, tool, and infrastructure layers. Useful telemetry distinguishes queue time, network time, model latency, retries, and downstream work. Prompts and outputs may contain sensitive data, so capture must be explicit and policy-aware.

## Procedure
1. Define the developer questions telemetry must answer.
2. Establish stable request, trace, session, and tool-call identifiers.
3. Instrument client, gateway, retrieval, model, and tool spans.
4. Record model/version, latency, token usage, status, retry count, and cache signals.
5. Add structured error events linked to the same trace.
6. Define prompt/output capture and redaction policy.
7. Avoid high-cardinality labels in metrics while retaining detail in traces.
8. Provide local debugging views and production dashboards.
9. Document sampling and retention limitations.
10. Test trace propagation through asynchronous and streaming paths.
11. Validate incident workflows using real failure scenarios.

## Decision points
Use metrics for aggregate health and alerts, traces for request diagnosis, and logs for structured events. Capture full content only when policy permits and the diagnostic value justifies the risk.

## Common failure patterns
No cross-service correlation, logging secrets, missing model/version metadata, aggregate latency with no stage breakdown, retry attempts hidden from users, and telemetry that cannot reconstruct a failed tool call.

## Verification
Trace representative success and failure requests end-to-end, confirm metadata and redaction, compare telemetry with billing/usage records, and verify operators can isolate the failing layer.

## Expected output
A documented observability contract, instrumentation guidance, dashboards, redaction rules, and diagnostic examples.

## Stop conditions
Stop when privacy policy does not permit proposed data capture, identifiers cannot propagate across required systems, or telemetry access creates unapproved data exposure.