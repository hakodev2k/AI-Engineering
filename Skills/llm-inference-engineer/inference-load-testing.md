# Inference Load Testing

## Purpose
Produce trustworthy capacity and latency evidence for LLM serving systems.

## When to use
Use before launch, after runtime/model/hardware changes, during capacity planning, and for performance regressions.

## Inputs
Production-like length distributions, arrival patterns, concurrency, sampling settings, SLOs, and deployment configuration.

## Context to inspect
Client timing, server queue metrics, token accounting, warm-up, autoscaling, rate limits, and accelerator telemetry.

## Core knowledge
LLM benchmarks must represent prompt tokens, generated tokens, arrival process, and concurrency. Closed-loop benchmarks can hide overload; averages hide tail collapse. TTFT and inter-token latency expose different bottlenecks.

## Procedure
1. Define workload classes from observed or forecast traffic.
2. Generate representative prompts without exposing sensitive production data.
3. Warm model, kernels, caches, and autoscaling state deliberately.
4. Run open-loop tests for arrival-rate capacity and closed-loop tests for controlled concurrency.
5. Sweep load through the saturation knee.
6. Record queue time, TTFT, inter-token latency, end-to-end latency, tokens/sec, errors, cache pressure, and GPU metrics.
7. Repeat long-context and burst scenarios.
8. Test one-replica loss and recovery.
9. Publish raw configuration and statistical summaries.

## Decision points
Use synthetic workloads only when they preserve relevant length and arrival distributions. Exclude warm-up only when production also guarantees warm state.

## Common failure patterns
Fixed tiny prompts, single concurrency, client bottlenecks, no token validation, and comparing runs with different output lengths.

## Verification
Repeat runs, check client generator headroom, reconcile server token counts, and require statistically stable results.

## Expected output
Reproducible benchmark report and safe capacity envelope.

## Stop conditions
Stop when the load generator or network becomes the bottleneck before the inference service.