# Latency Decomposition

## Purpose
Decompose AI request latency into causal components so optimization targets the actual bottleneck.

## When to use
Use for slow requests, tail-latency regressions, streaming delays, or capacity planning.

## Inputs
Traces, latency histograms, request sizes, token counts, provider metrics, network data, and deployment changes.

## Context to inspect
Inspect queueing, DNS/TLS/connect time, retrieval, reranking, prompt assembly, provider admission, TTFT, generation, tools, retries, post-processing, and client streaming.

## Core knowledge
End-to-end latency is a critical path, not a sum of independent averages. TTFT and inter-token latency affect perceived performance differently. Queueing and retry amplification often dominate tails.

## Procedure
1. Define the user-visible latency boundary.
2. Segment traces by route, model, provider, region, context size, and outcome.
3. Build latency distributions for each critical-path stage.
4. Compare p50/p95/p99 and inspect representative tail traces.
5. Correlate TTFT with prompt size and generation time with output tokens.
6. Separate queueing from service time and network from provider time.
7. Quantify retry and fallback amplification.
8. Form a bottleneck hypothesis and change one major variable at a time.
9. Re-measure under comparable traffic.

## Decision points
Optimize perceived latency when streaming can improve UX without reducing total compute. Scale capacity when queueing dominates; optimize prompts/models when inference dominates.

## Common failure patterns
Using averages, adding unrelated percentiles, blaming the model without trace evidence, ignoring cold starts, and benchmarking synthetic requests unlike production.

## Verification
Show before/after distributions under comparable load and confirm the targeted stage improved without moving failure or cost elsewhere.

## Expected output
A latency budget, causal bottleneck analysis, measured remediation, and regression guardrails.

## Stop conditions
Stop when clocks are unsynchronized, traces are incomplete, or traffic cohorts are not comparable enough to support a conclusion.