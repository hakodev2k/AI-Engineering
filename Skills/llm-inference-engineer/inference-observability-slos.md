# Inference Observability and SLOs

## Purpose
Instrument LLM serving so operators can connect client experience to scheduler, model, cache, and accelerator behavior.

## When to use
Use when defining production readiness, dashboards, alerts, incident diagnostics, or capacity controls.

## Inputs
Service objectives, runtime metrics, request metadata, token accounting, infrastructure telemetry, and privacy constraints.

## Context to inspect
Gateway metrics, traces, scheduler, runtime exporters, GPU telemetry, logs, alert rules, and version labels.

## Core knowledge
Core client metrics include availability, TTFT, inter-token latency, end-to-end latency, and correctness/error rate. Operational metrics include queue age, active tokens, prefill/decode throughput, cache occupancy, GPU memory/utilization, and version identity.

## Procedure
1. Define SLIs and SLOs by workload class and percentile.
2. Instrument request lifecycle with consistent timestamps and request IDs.
3. Record input/output token counts and model/runtime version.
4. Export scheduler, cache, and accelerator metrics.
5. Correlate traces without recording sensitive prompt content.
6. Build dashboards from client outcome down to resource bottlenecks.
7. Alert on SLO burn and leading saturation indicators, not noisy raw counters alone.
8. Control label cardinality and retention cost.
9. Validate telemetry during failures and overload.

## Decision points
Sample traces when volume/cost requires it, but preserve unbiased latency metrics. Use per-tenant labels only with bounded identity sets.

## Common failure patterns
Only GPU dashboards, averages instead of percentiles, missing model-version labels, high-cardinality request labels, and sensitive payload logging.

## Verification
Inject known failures and load; confirm alerts fire and telemetry identifies the failing stage.

## Expected output
SLO definitions, dashboards, alerts, and diagnostic telemetry.

## Stop conditions
Escalate when privacy rules prohibit required telemetry and no safe aggregate can support operations.