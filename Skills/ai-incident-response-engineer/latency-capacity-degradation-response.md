# Latency and Capacity Degradation Response

## Purpose
Restore acceptable AI response latency and throughput while preserving correctness and safety.

## When to use
Use for queue growth, timeouts, token-per-second degradation, GPU saturation, provider throttling, or long agent workflows.

## Inputs
Latency percentiles, queue depth, tokens/sec, concurrency, model mix, hardware utilization, provider metrics, traffic shape.

## Preconditions
Know workload priorities and safe degradation options.

## Context to inspect
Batching, streaming, autoscaling, rate limits, context size, output length, retries, model routing, tool latency, retrieval latency.

## Core knowledge
AI latency is influenced by prefill, decode, context length, output length, batching, queueing, tool chains, and external provider limits.

## Procedure
1. Separate queueing, model compute, retrieval, tool, and network latency.
2. Identify saturated resource or throttled dependency.
3. Check traffic and prompt-size changes.
4. Reduce retry amplification.
5. Prioritize critical workloads.
6. Enable validated smaller/faster models where appropriate.
7. Cap pathological context or output sizes.
8. Scale capacity when bottleneck evidence supports it.
9. Monitor p50/p95/p99 and quality after mitigation.

## Decision points
Scale only after confirming resource saturation; otherwise fix bottlenecks or request inflation first.

## Common failure patterns
Adding capacity to a retry storm, optimizing mean latency only, dropping safety checks for speed, and ignoring tool latency.

## Verification
Latency SLOs recover across key segments without unacceptable quality or safety regression.

## Expected output
Bottleneck diagnosis, mitigation actions, recovered capacity metrics, and prevention items.

## Stop conditions
Escalate when emergency capacity changes require unapproved cost or architecture changes.