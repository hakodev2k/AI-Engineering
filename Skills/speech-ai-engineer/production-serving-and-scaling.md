# Production Serving and Scaling

## Purpose
Design reliable serving architectures for speech inference with predictable latency, throughput, isolation, and cost under bursty real-world traffic.

## When to use
Use when deploying ASR, TTS, diarization, verification, or other speech models as production services.

## Inputs
- Model artifacts
- Traffic profile
- Concurrency and latency SLOs
- Hardware options
- Streaming/batch requirements
- Cost constraints

## Context to inspect
Inspect request duration distribution, audio upload patterns, GPU/CPU utilization, model loading time, batching opportunities, session state, autoscaling behavior, queue depth, and failure recovery.

## Core knowledge
Speech workloads are duration-dependent and often stateful. Throughput is influenced by audio length, batching, sequence padding, decoder cost, model residency, and accelerator scheduling. Queueing can dominate p99 latency even when model inference is fast.

## Procedure
1. Define service contract, size limits, and timeout policy.
2. Separate streaming and batch workload assumptions where needed.
3. Benchmark single-request latency and maximum sustainable throughput.
4. Profile accelerator utilization and memory residency.
5. Select safe batching or dynamic batching strategy.
6. Bound queues and implement admission control.
7. Define autoscaling signals using demand and saturation, not CPU alone.
8. Add per-session isolation and cleanup for streaming workloads.
9. Implement retries only for safe/idempotent operations.
10. Load-test realistic duration and concurrency distributions.
11. Validate degraded behavior during accelerator loss, cold start, and dependency failures.
12. Document capacity and cost per workload unit.

## Decision points
Use dedicated model pools when isolation or predictable latency matters; consolidate models when utilization dominates. Batch aggressively for offline jobs, conservatively for interactive speech.

## Common failure patterns
- Sizing from average audio duration
- Unbounded queues causing latency collapse
- Treating GPU utilization as the only saturation signal
- Retrying long inference blindly
- Mixing incompatible streaming and batch traffic

## Verification
Verify p50/p95/p99 latency, throughput, queue behavior, resource saturation, failure recovery, autoscaling, and cost under representative load.

## Expected output
A capacity-tested serving design with scaling policy, limits, failure handling, benchmarks, and operational runbook.

## Stop conditions
Stop if latency SLOs cannot be achieved at expected concurrency, state isolation is unsafe, or cost exceeds agreed constraints without architectural trade-off review.