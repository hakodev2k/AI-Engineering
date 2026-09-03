# Latency Budgeting

## Purpose
Decompose end-to-end inference latency into measurable stage budgets so optimization targets the real bottleneck instead of shifting delay between components.

## When to use
Use when an inference API misses response-time SLOs, when adding a model stage, or before optimizing a serving stack.

## Inputs
SLOs, traces, request-size distributions, model timing, tokenizer timing, network timing, queue metrics, and client timeout behavior.

## Context to inspect
Inspect client-to-edge latency, request parsing, tokenization, queue time, prefill, decode, postprocessing, serialization, network hops, retries, and downstream calls.

## Core knowledge
Tail latency is governed by the slowest path and queueing amplification. Time-to-first-token and inter-token latency should be treated separately for streaming systems. Budgets must reflect percentile targets, not only averages.

## Procedure
1. Define user-visible latency metrics and percentile SLOs.
2. Capture distributed traces for representative traffic.
3. Split latency into deterministic stages.
4. Quantify p50, p95, and p99 per stage.
5. Identify serial critical-path components.
6. Measure queue delay under increasing concurrency.
7. Allocate a latency budget to each stage with headroom.
8. Prioritize stages by recoverable milliseconds and engineering cost.
9. Re-run measurements after each change.
10. Rebalance budgets when architecture changes.

## Decision points
Optimize TTFT when interactive responsiveness dominates; optimize decode throughput when long generations dominate. Reduce queueing before kernel micro-optimization when waiting time exceeds execution time.

## Common failure patterns
Using averages, omitting client/network time, measuring warm requests only, mixing short and long workloads, and celebrating faster kernels while p99 worsens from higher queueing.

## Verification
Implemented means budgets and instrumentation exist. Verified means repeated production-like tests show each stage stays within its allocated percentile budget under target load.

## Expected output
Latency budget table, trace evidence, prioritized bottlenecks, and before/after measurements.

## Stop conditions
Escalate when tracing is incomplete, SLO ownership is unclear, or external dependencies dominate latency without actionable controls.