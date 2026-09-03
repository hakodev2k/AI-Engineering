# Inference Observability

## Purpose
Instrument inference systems so latency, saturation, quality proxies, failures, and resource behavior can be diagnosed quickly and correlated to workload characteristics.

## When to use
Use when operating any production inference service or when optimization decisions lack trustworthy measurements.

## Inputs
Service topology, SLOs, runtime metrics, tracing stack, logs, model metadata, hardware counters, and privacy constraints.

## Context to inspect
Inspect request IDs, model/version labels, prompt/output length, queue time, TTFT, decode rate, GPU memory/utilization, cache metrics, scheduler state, errors, and retries.

## Core knowledge
Useful observability connects user-visible symptoms to serving stages and resource state. High-cardinality labels can become expensive or unsafe; raw prompts and outputs should not be logged by default.

## Procedure
1. Define service-level indicators for latency, availability, and throughput.
2. Add stage-level timing for queue, preprocess, prefill, decode, and postprocess.
3. Record workload dimensions using privacy-safe aggregates.
4. Instrument GPU memory, utilization, scheduler occupancy, and KV cache behavior.
5. Correlate logs, metrics, and traces with model/runtime versions.
6. Add alerts for SLO burn, queue growth, OOM, error spikes, and capacity loss.
7. Build dashboards by workload class and hardware pool.
8. Validate telemetry under failure and overload.
9. Control cardinality and retention costs.
10. Review signals after incidents and optimization changes.

## Decision points
Use traces for critical-path diagnosis, metrics for fleet trends and alerts, and structured logs for discrete state transitions. Sample aggressively only after ensuring rare failures remain observable.

## Common failure patterns
Only monitoring GPU utilization, logging sensitive content, missing queue latency, no version labels, cardinality explosions, and dashboards that cannot distinguish workload mix changes from regressions.

## Verification
Verified means a controlled latency, capacity, and failure scenario can be localized from telemetry without direct host inspection.

## Expected output
SLIs, dashboards, alerts, trace schema, safe labels, and telemetry validation evidence.

## Stop conditions
Escalate when privacy rules prohibit necessary data without an approved aggregation strategy or telemetry overhead materially changes service behavior.