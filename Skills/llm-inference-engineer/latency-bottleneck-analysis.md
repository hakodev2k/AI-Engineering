# Latency Bottleneck Analysis

## Purpose
Localize LLM latency regressions to queueing, prefill, decode, communication, runtime, or downstream infrastructure.

## When to use
Use when TTFT, inter-token latency, or tail latency misses objectives.

## Inputs
Request traces, token counts, runtime metrics, GPU profiles, deployment changes, and baseline measurements.

## Context to inspect
Gateway, queue, scheduler, model runtime, collectives, kernels, cache, network, streaming path, and client timing.

## Core knowledge
End-to-end latency is a pipeline. TTFT often includes queue plus prefill; decode latency exposes per-step execution and scheduling. Saturation creates nonlinear queue growth, so correlation with utilization matters.

## Procedure
1. Reproduce the regression with a controlled workload.
2. Decompose latency into client, gateway, queue, prefill, decode, and network phases.
3. Compare token-length distributions with the baseline.
4. Inspect GPU occupancy, memory bandwidth, kernel gaps, collectives, and cache pressure.
5. Vary one dimension at a time: concurrency, prompt length, output length, batch limits, and parallelism.
6. Identify the saturation knee and resource bottleneck.
7. Form a falsifiable hypothesis and test the smallest change.
8. Confirm improvement does not shift failure to another percentile or workload class.
9. Preserve before/after evidence.

## Decision points
Optimize kernels only after queueing and workload shifts are excluded. Scale capacity when the system is genuinely saturated; tune scheduling when capacity exists but is poorly utilized.

## Common failure patterns
Profiling only averages, changing several knobs simultaneously, ignoring client backpressure, and declaring high GPU utilization healthy.

## Verification
Re-run identical workloads, compare distributions and profiles, and confirm production-like tail improvement.

## Expected output
Root cause, evidence, remediation, and regression guardrail.

## Stop conditions
Escalate when required profiling access is unavailable or evidence indicates hardware/runtime defects.