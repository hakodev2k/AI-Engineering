# Latency and Throughput Benchmarking

## Purpose
Produce reproducible serving benchmarks that predict real workload behavior and support architecture/capacity decisions.

## When to use
Use before runtime, hardware, quantization, scheduler, model, or configuration changes.

## Inputs
Representative traces, model artifacts, hardware, runtime configuration, SLOs, baseline results.

## Context to inspect
Prompt/output lengths, concurrency, arrival patterns, warmup, batching, network path, tokenizer, and measurement definitions.

## Core knowledge
Report TTFT, time per output token, end-to-end latency, tokens/sec, queue time, and tail percentiles. Open-loop tests reveal overload differently from closed-loop concurrency tests. A benchmark is invalid when workloads differ between candidates.

## Procedure
1. Define hypotheses and acceptance thresholds. 2. Freeze model/tokenizer/runtime versions. 3. Build workload distributions from production or justified proxies. 4. Warm the system. 5. Run controlled sweeps across arrival rate/concurrency. 6. Capture p50/p95/p99 latency and throughput. 7. Record GPU, CPU, memory, network, power, and queue metrics. 8. Repeat runs and quantify variance. 9. Test saturation and recovery. 10. Publish raw configuration and methodology.

## Decision points
Use open-loop arrival-rate tests for capacity/SLO analysis and closed-loop tests for client-concurrency behavior; use both for major decisions.

## Common failure patterns
Single prompt sizes, averages only, no warmup, comparing different token counts, ignoring queueing, and benchmarking directly on noisy shared hardware without controls.

## Verification
A second run or operator should reproduce results within documented variance using the recorded configuration.

## Expected output
A reproducible benchmark report with saturation point, SLO envelope, bottlenecks, and decision recommendation.

## Stop conditions
Stop if candidates cannot be configured equivalently, instrumentation is unreliable, or workload representativeness is unknown.