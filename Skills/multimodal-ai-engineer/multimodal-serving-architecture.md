# Multimodal Serving Architecture

## Purpose
Design production serving paths for multimodal models that balance preprocessing, batching, accelerator utilization, latency, cost, and failure isolation across heterogeneous inputs.

## When to use
Use when deploying multimodal inference, scaling a prototype, migrating providers, or investigating serving bottlenecks.

## Inputs
Model artifacts or APIs, modality processors, traffic profile, latency SLOs, throughput targets, hardware/provider constraints, cost limits.

## Preconditions
Have representative request-size distributions and a validated offline model/preprocessing combination.

## Context to inspect
Inspect upload paths, media storage, preprocessing workers, tokenization, GPU/accelerator memory, batching, queues, timeouts, retries, caching, autoscaling, and downstream consumers.

## Core knowledge
Multimodal requests vary dramatically in compute and memory. Large images, long audio, and video can create head-of-line blocking and poor batching efficiency. Separating media preprocessing from model execution can improve resource utilization, while excessive decomposition adds network and coordination overhead.

## Procedure
1. Characterize traffic by modality, size, duration, and concurrency.
2. Decompose preprocessing, inference, and postprocessing latency.
3. Define request limits and admission controls.
4. Choose synchronous versus asynchronous paths by workload.
5. Group compatible requests for batching without violating latency SLOs.
6. Isolate long-running media jobs from interactive traffic when needed.
7. Define timeout, retry, idempotency, and cancellation semantics.
8. Cache only deterministic, permission-safe intermediate results.
9. Size accelerator memory using worst realistic request mixtures.
10. Configure autoscaling from queue and utilization signals.
11. Load test skewed traffic and oversized requests.
12. Establish rollback and provider/model failover procedures.

## Decision points
Use hosted APIs when operational simplicity outweighs control; self-host when cost, privacy, latency, or custom kernels justify it. Split preprocessing into dedicated workers when CPU/media decoding limits accelerator utilization.

## Common failure patterns
Batching incompatible request shapes; retry storms on expensive inference; no request-size limits; interactive traffic blocked by video jobs; caching sensitive media without access-aware keys; scaling only on CPU metrics.

## Verification
Run realistic load tests, measure p50/p95/p99 latency, accelerator utilization, queue time, error rate, and cost per request. Verify cancellation and retry behavior under failure.

## Expected output
A capacity-tested serving architecture with SLOs, resource controls, scaling rules, failure semantics, and cost model.

## Stop conditions
Stop when serving cannot meet latency/cost targets on representative load or privacy/security constraints cannot be satisfied by the selected deployment model.