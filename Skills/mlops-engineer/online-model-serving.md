# Online Model Serving

## Purpose
Design and operate low-latency model inference services with explicit SLOs, resource isolation, concurrency control, safe failure behavior, and scalable capacity.

## When to use
Use for synchronous APIs, interactive predictions, real-time ranking, or embedded service-to-service inference.

## Inputs
Model package, request/response schema, latency SLO, throughput profile, hardware, autoscaling limits, failure policy.

## Preconditions
Model behavior and package integrity are validated.

## Context to inspect
Serving framework, gateway, load balancer, container/runtime limits, accelerator scheduling, feature dependencies, telemetry, and fallback behavior.

## Core knowledge
Serving performance depends on batching, queueing, concurrency, model load time, warmup, memory, downstream features, and tail latency. Availability must define behavior when the model is unavailable or uncertain.

## Procedure
1. Define request contract and timeout budget.
2. Benchmark single-instance latency and saturation.
3. Select concurrency and batching strategy.
4. Set memory/CPU/GPU limits and health checks.
5. Define warmup and model-loading behavior.
6. Configure autoscaling from useful saturation signals.
7. Add request, latency, error, and model-version telemetry.
8. Implement bounded retries and fallbacks where valid.
9. Load-test tail latency and overload behavior.
10. Test rolling restart and model replacement.

## Decision points
Dedicated vs multi-model serving; dynamic batching vs immediate inference; fallback model vs explicit failure; scale-to-zero only when cold starts fit requirements.

## Common failure patterns
Unbounded queues, retry storms, autoscaling on CPU while GPU is saturated, hidden cold starts, oversized batches, and missing model version in logs.

## Verification
Meet p50/p95/p99 latency, throughput, error, and recovery SLOs under representative and overload traffic.

## Expected output
Serving configuration, capacity benchmark, SLOs, fallback policy, dashboards, and operational limits.

## Stop conditions
Escalate when overload can violate safety, tail latency is unexplained, or dependency failures cannot be bounded.