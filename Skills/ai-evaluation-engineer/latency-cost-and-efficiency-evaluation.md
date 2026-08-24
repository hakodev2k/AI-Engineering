# Latency, Cost, and Efficiency Evaluation

## Purpose
Measure whether AI system quality is achieved within acceptable latency, throughput, token, tool-call, and monetary budgets.

## When to use
Use when comparing models, prompts, agent policies, RAG configurations, batching strategies, or release candidates with operational cost or responsiveness constraints.

## Inputs
- Representative workloads
- Candidate system configurations
- Latency and cost budgets
- Token and tool-call traces
- Concurrency targets

## Context to inspect
Inspect model pricing assumptions, caching, retries, context size, streaming behavior, external dependencies, concurrency limits, and production traffic shape.

## Core knowledge
Quality and efficiency are jointly optimized. Mean latency can hide tail failures; per-request cost can hide expensive slices. Senior evaluation uses percentiles, workload segmentation, warm/cold behavior, and quality-per-cost comparisons.

## Procedure
1. Define workload mixes and operational budgets.
2. Capture end-to-end latency plus major stage timings.
3. Measure p50, p95, p99, timeout rate, and throughput where relevant.
4. Record input/output tokens, retrieval volume, tool calls, retries, and external costs.
5. Separate warm-cache and cold-cache behavior.
6. Evaluate under realistic concurrency rather than only serial requests.
7. Join efficiency metrics to task-quality results by example.
8. Identify expensive low-value steps and pathological slices.
9. Compare candidates using quality-versus-cost and quality-versus-latency frontiers.
10. Define release gates for unacceptable tails or cost regressions.

## Decision points
Prefer a more expensive configuration when quality gains justify the product value; prefer cheaper/faster variants when quality is statistically equivalent. Optimize tail latency for interactive systems and throughput for batch workloads.

## Common failure patterns
- Reporting only mean latency
- Ignoring retries and tool costs
- Testing tiny contexts only
- Comparing pricing with inconsistent token accounting
- Optimizing cost while silently degrading high-risk quality slices

## Verification
Re-run representative load, reconcile measured usage against provider billing or internal accounting, and confirm quality metrics use the same evaluated requests.

## Expected output
An efficiency report with latency percentiles, throughput, cost, resource drivers, and quality-efficiency trade-offs.

## Stop conditions
Stop when workload assumptions are unrealistic, pricing/accounting inputs are unknown, or rate limits prevent a representative measurement.