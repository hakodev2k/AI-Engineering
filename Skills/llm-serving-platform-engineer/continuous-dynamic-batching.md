# Continuous and Dynamic Batching

## Purpose
Engineer batching policies that raise accelerator throughput without violating per-request latency SLOs.

## When to use
Use when GPU utilization, queueing, TTFT, or throughput indicates inefficient request scheduling.

## Inputs
Traffic traces, prompt/output distributions, latency SLOs, runtime batching controls, GPU metrics.

## Context to inspect
Scheduler implementation, batch limits, token budgets, queue discipline, cancellation, memory pressure, and benchmark results.

## Core knowledge
Continuous batching admits and retires sequences at token boundaries; batch size alone is insufficient because token count, sequence length, KV cache, and prefill cost determine resource pressure. Larger batches improve utilization but can worsen queueing and tail latency.

## Procedure
1. Capture representative traffic distributions. 2. Establish baseline TTFT, TPOT, throughput, queue time, and memory. 3. Identify scheduler constraints. 4. Tune token and sequence limits incrementally. 5. Separate or prioritize large-prefill traffic when it causes head-of-line blocking. 6. Validate cancellation and completed-sequence eviction. 7. Test bursts and mixed context lengths. 8. Set guardrails and rollback thresholds. 9. Document safe operating ranges.

## Decision points
Prefer token-budget controls over request-count-only controls. Use priority classes only when business/SLO differentiation is real. Isolate extreme long-context traffic if it materially damages common-case latency.

## Common failure patterns
Benchmarking uniform prompts, maximizing batch size, ignoring queue time, starving short requests, retaining cancelled sequences, and tuning without memory headroom.

## Verification
Compare production-shaped load tests against baseline at p50/p95/p99 latency, tokens/sec, queue depth, GPU utilization, and OOM rate.

## Expected output
A measured batching configuration and documented latency-throughput trade-off envelope.

## Stop conditions
Stop if traffic distributions are unavailable, runtime controls are undocumented, or tests approach unsafe memory limits.