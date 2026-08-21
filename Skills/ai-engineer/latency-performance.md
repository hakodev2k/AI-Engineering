# AI Latency and Performance Engineering

## Purpose
Reduce end-to-end AI response time while protecting quality, reliability, and cost.

## When to use
Use when p50/p95 latency, time-to-first-token, throughput, or user-perceived responsiveness misses targets.

## Inputs
Distributed traces, provider timings, token counts, retrieval timings, tool timings, concurrency, SLOs.

## Preconditions
Measure the full critical path before optimizing.

## Context to inspect
Network calls, model inference, retrieval, reranking, tool execution, serialization, queues, streaming, retries, context size.

## Core knowledge
AI latency is compositional. Prompt size, output length, model choice, sequential tool calls, retrieval stages, retries, and queueing can dominate different percentiles. Streaming improves perceived latency but not total compute.

## Procedure
1. Establish p50/p95/p99 and time-to-first-token baselines.
2. Break latency down by stage using traces.
3. Optimize the dominant component first.
4. Parallelize independent retrieval/tool calls safely.
5. Reduce unnecessary context and output tokens.
6. Select faster models where evaluations pass.
7. Stream responses when partial output improves UX.
8. Bound retries, agent steps, and queue depth.
9. Load test realistic concurrency.
10. Re-measure quality, cost, and latency together.

## Decision points
Parallelize only independent operations. Use streaming for interactive experiences; background tasks may optimize throughput instead. Do not downgrade models without evaluation evidence.

## Common failure patterns
Optimizing averages only, serial independent calls, hidden retry latency, excessive context, unbounded agents, and mistaking streaming for lower compute latency.

## Verification
Compare percentile latency, throughput, quality, and error rate under representative load.

## Expected output
A measured performance improvement with stage-level evidence and preserved quality thresholds.

## Stop conditions
Stop when tracing is insufficient to identify the bottleneck or proposed changes violate quality/SLO requirements.