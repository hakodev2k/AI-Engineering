# Inference Performance Qualification

## Purpose
Prove that a candidate meets latency, throughput, resource, and stability requirements under realistic inference workloads.

## When to use
Use before releasing new models, quantization, serving runtimes, batching policies, hardware mappings, or context-window changes.

## Inputs
SLOs, workload traces or distributions, candidate deployment, baseline metrics, hardware profile, concurrency targets, and capacity limits.

## Preconditions
A representative environment and repeatable load-generation method exist.

## Context to inspect
Inspect token-length distributions, streaming behavior, batching, cache usage, accelerator utilization, autoscaling, network overhead, and warm-up behavior.

## Core knowledge
AI serving latency is workload-sensitive. Time-to-first-token, inter-token latency, total latency, queue time, throughput, memory, and accelerator utilization reveal different bottlenecks.

## Procedure
1. Define representative request classes and SLOs.
2. Establish baseline measurements with equivalent infrastructure.
3. Warm the candidate appropriately and document cold-start behavior separately.
4. Test increasing concurrency through expected peak and overload.
5. Measure tail latency, queueing, throughput, memory, compute utilization, and errors.
6. Test long-context and high-output cases.
7. Observe autoscaling and recovery after load spikes.
8. Identify bottlenecks and tune one variable at a time.
9. Repeat after tuning and compare with baseline.
10. Record safe operating envelope and capacity assumptions.

## Decision points
Use batching when throughput gains justify added latency. Scale out when contention dominates and architecture supports it; optimize model/runtime first when per-request inefficiency dominates.

## Common failure patterns
Average-latency reporting, unrealistic short prompts, no overload test, warmed-only benchmarks, hidden throttling, and comparing different hardware or sampling settings.

## Verification
Reproduce tests from pinned workloads and confirm tail SLOs and error budgets at target concurrency.

## Expected output
A performance qualification report with operating envelope, bottlenecks, capacity assumptions, and release decision.

## Stop conditions
Stop if environment is nonrepresentative, metrics are unreliable, overload threatens shared systems, or required capacity cannot meet SLOs safely.
