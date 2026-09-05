# Latency Breakdown and Profiling

## Purpose
Decompose end-to-end inference latency so optimization targets measured bottlenecks rather than intuition.

## When to use
Use when TTFT, inter-token latency, or p95/p99 latency misses SLOs or changes after a runtime/model release.

## Inputs
Distributed traces, runtime metrics, scheduler metrics, request samples, model/hardware configuration, and baseline measurements.

## Preconditions
Clock synchronization and request correlation are reliable enough to separate stages.

## Context to inspect
Gateway, queue, tokenizer, retrieval if present, scheduler, prefill, decode, network, serialization, streaming, and downstream tool/service time.

## Core knowledge
AI latency combines fixed overhead, queueing, prompt prefill, iterative decode, network transport, and client perception. Optimizing one stage can worsen another through batching or concurrency effects.

## Procedure
1. Establish latency SLO and representative failing segments.
2. Trace request stages separately.
3. Measure queue time, TTFT, per-token decode, and total response time.
4. Correlate latency with input/output length and concurrency.
5. Check GPU occupancy, memory pressure, and kernel gaps.
6. Compare healthy and slow requests.
7. Form a ranked bottleneck hypothesis list.
8. Change one major variable at a time.
9. Re-benchmark under realistic load.
10. Record before/after evidence.

## Decision points
Optimize queueing and scheduling before low-level kernels when wait time dominates; optimize compute only when accelerator work is the proven bottleneck.

## Common failure patterns
Using averages, profiling single requests only, ignoring prompt length, and optimizing server metrics that do not improve user-visible latency.

## Verification
A measured bottleneck explains a material share of latency and the change improves target percentiles under representative load.

## Expected output
A latency budget, bottleneck ranking, evidence, and validated optimization plan.

## Stop conditions
Escalate when missing instrumentation prevents trustworthy attribution.