# Serving Observability

## Purpose
Instrument model serving so responders can distinguish queueing, compute, memory, routing, model-quality, and dependency failures quickly.

## When to use
Use when designing production serving, preparing incident response, or closing observability gaps discovered during outages.

## Inputs
Serving architecture, SLOs, runtime metrics, trace capabilities, logging policy, model metadata, and alerting requirements.

## Preconditions
Telemetry must avoid unnecessary sensitive prompt/output capture and follow retention policy.

## Context to inspect
Request IDs, model/version tags, queue metrics, TTFT, inter-token latency, throughput, tokens, GPU metrics, KV cache, batch size, errors, routing, and startup state.

## Core knowledge
AI serving requires workload-aware telemetry. GPU utilization alone cannot explain whether the system is healthy; queue delay, active sequences, token distributions, cache pressure, batch efficiency, and model-specific error signals are essential.

## Procedure
1. Define user-facing SLOs and diagnostic questions.
2. Add correlation across gateway, scheduler, runtime, and downstream services.
3. Tag model, revision, runtime, hardware, region, and route.
4. Measure queue time, TTFT, decode latency, end-to-end latency, and throughput.
5. Record token and context distributions.
6. Export GPU, memory, KV-cache, batch, and scheduler metrics.
7. Add startup, reload, eviction, and OOM indicators.
8. Build dashboards around saturation and SLOs.
9. Define actionable alerts with ownership.
10. Validate telemetry during load and failure tests.

## Decision points
Use sampled traces for scale but preserve high-value failure traces when policy allows. Prefer metrics for alerting and traces for diagnosis.

## Common failure patterns
Only infrastructure dashboards, missing model/version labels, logging sensitive content by default, and alerts without runbooks.

## Verification
Known failure scenarios produce enough telemetry to identify the failing stage and impacted model pool.

## Expected output
A documented observability baseline with dashboards, alerts, dimensions, and retention rules.

## Stop conditions
Escalate when privacy constraints or missing runtime hooks prevent safe diagnostic coverage.