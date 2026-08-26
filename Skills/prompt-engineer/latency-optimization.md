# Prompt Latency Optimization

## Purpose
Reduce end-to-end AI response latency without compromising correctness or operational safety.

## When to use
Use when interactive UX, batch throughput, or service SLOs are affected by model workflows.

## Inputs
End-to-end traces, model latency, token counts, retrieval/tool timings, concurrency limits, and quality thresholds.

## Context to inspect
Break latency into retrieval, prompt construction, queueing, time-to-first-token, generation, tool calls, retries, and post-processing.

## Core knowledge
Prompt length, output length, model size, serial tool chains, retries, and provider queueing all affect latency. Optimize the dominant measured component.

## Procedure
1. Establish p50/p95/p99 baseline by task slice.
2. Decompose latency across pipeline stages.
3. Reduce unnecessary context and requested output.
4. Parallelize independent retrieval/tool work where safe.
5. Remove redundant model turns.
6. Benchmark faster models against quality thresholds.
7. Use streaming when it improves perceived latency without hiding completion requirements.
8. Bound retries and timeouts.
9. Load-test realistic concurrency.
10. Re-evaluate tail latency after changes.

## Decision points
Optimize perceived latency with streaming for human consumption; optimize completion latency for machine consumers. Prefer fewer serial turns over micro-optimizing prompt wording.

## Common failure patterns
Reporting only average latency; streaming an answer before required validation; retries amplifying tail latency; reducing context without quality tests; ignoring tool bottlenecks.

## Verification
Compare end-to-end percentile latency, quality metrics, error rate, and timeout rate under representative load.

## Expected output
Latency profile, prioritized bottlenecks, implemented optimizations, and before/after evidence.

## Stop conditions
Stop when improvements require violating quality/SLO trade-offs not approved by owners or when traces cannot isolate the bottleneck.