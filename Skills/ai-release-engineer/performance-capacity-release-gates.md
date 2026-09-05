# Performance and Capacity Release Gates

## Purpose
Verify that an AI release can meet latency, throughput, concurrency, and capacity requirements under realistic workloads without hiding bottlenecks behind average metrics.

## When to use
Use for model upgrades, context-window changes, routing changes, infrastructure updates, retrieval changes, or agent workflows that alter request cost or execution length.

## Inputs
Latency SLOs, workload profile, concurrency targets, tokens per request, model/provider limits, infrastructure metrics, load-test results.

## Preconditions
A production-like performance environment or representative benchmark harness exists.

## Context to inspect
Queueing, prefill/decode behavior, batching, retrieval latency, tool latency, retry policy, autoscaling, provider quotas, and regional capacity.

## Core knowledge
AI latency is often dominated by context length, output length, queueing, model throughput, tool chains, and external provider limits. Mean latency is insufficient; tail latency and saturation behavior determine production reliability.

## Procedure
1. Define expected workload and peak traffic.
2. Measure p50, p95, and p99 latency.
3. Separate queue, model, retrieval, tool, and network time.
4. Measure throughput and saturation points.
5. Test realistic context and output sizes.
6. Validate autoscaling and quota behavior.
7. Exercise dependency degradation and timeout paths.
8. Compare candidate results with the current baseline.
9. Define release abort thresholds.
10. Record capacity headroom before rollout.

## Decision points
Scale capacity only when evidence shows resource saturation. Prefer workload shaping or model routing when additional infrastructure would not address the true bottleneck.

## Common failure patterns
Testing tiny prompts, measuring only averages, excluding provider throttling, ignoring long agent workflows, and load-testing without production-like concurrency.

## Verification
Repeat benchmark runs and confirm latency, throughput, and capacity headroom remain within accepted thresholds.

## Expected output
A performance gate report with bottlenecks, capacity margin, thresholds, and release decision.

## Stop conditions
Stop release when peak workload cannot be served safely or performance regressions threaten critical SLOs.