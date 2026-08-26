# Serving Observability

## Purpose
Create telemetry that explains inference latency, capacity, failures, model behavior, and cost without exposing sensitive prompts.

## When to use
Use when establishing production readiness, diagnosing incidents, or adding new serving components.

## Inputs
SLOs, architecture, request lifecycle, tenancy model, privacy requirements, runtime metrics.

## Context to inspect
Gateway, queue, scheduler, workers, GPU telemetry, model loader, autoscaler, tracing, logs, and dashboards.

## Core knowledge
LLM serving requires request-, token-, model-, and resource-level signals. High-cardinality labels can overwhelm telemetry systems. Prompt content is sensitive and should not be logged by default.

## Procedure
1. Map request stages from ingress to completion. 2. Define RED signals and model-serving metrics: TTFT, TPOT, queue time, tokens, active sequences, KV pressure, batch size, utilization, OOM, rejection. 3. Add correlation IDs across hops. 4. Trace sampled requests with stage timing. 5. Use bounded labels for model/version/region/class. 6. Redact or omit content. 7. Build SLO and saturation dashboards. 8. Alert on symptoms plus capacity precursors. 9. Validate telemetry during load and failure tests. 10. Document metric semantics.

## Decision points
Prefer metrics for broad detection, traces for request-path attribution, and logs for discrete events. Sample high-volume traces rather than losing metrics to cardinality.

## Common failure patterns
Logging prompts, unbounded tenant/request labels, GPU-only dashboards, missing queue time, inconsistent token definitions, and alerts without runbooks.

## Verification
Inject known latency/failure conditions and confirm telemetry identifies the affected stage and SLO impact.

## Expected output
A privacy-safe observability contract, dashboards, alerts, and diagnostic traces.

## Stop conditions
Stop when privacy policy is unclear, metric semantics cannot be made consistent, or critical stages are not instrumentable.