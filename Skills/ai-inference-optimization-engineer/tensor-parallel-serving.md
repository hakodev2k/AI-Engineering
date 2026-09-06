# Tensor Parallel Serving

## Purpose
Use tensor parallelism to serve models that exceed single-device capacity or require more compute bandwidth than one accelerator can provide.

## When to use
Use when a model cannot fit efficiently on one device or when measured latency improves by splitting matrix operations across tightly connected accelerators.

## Inputs
Model architecture, parameter size, precision, accelerator count, interconnect topology, runtime support, target latency, and throughput requirements.

## Context to inspect
Inspect layer dimensions, communication collectives, device topology, NVLink or equivalent bandwidth, memory headroom, kernel support, and runtime partitioning rules.

## Core knowledge
Tensor parallelism trades local compute for collective communication. Benefits depend heavily on high-bandwidth low-latency interconnects and balanced shards. More devices do not guarantee lower latency because synchronization overhead grows.

## Procedure
1. Measure single-device feasibility and baseline performance.
2. Identify model layers and dimensions eligible for partitioning.
3. Map candidate parallel widths to physical topology.
4. Estimate communication volume for critical collectives.
5. Benchmark candidate widths with identical workload shapes.
6. Inspect compute/communication overlap in profiler traces.
7. Verify shard balance and per-device memory usage.
8. Test interactions with batching, quantization, and KV cache.
9. Measure scaling efficiency rather than raw throughput only.
10. Select the smallest parallel width that meets memory and latency targets.

## Decision points
Prefer single-device serving when it fits and meets SLOs. Use tensor parallelism across tightly connected devices before crossing slow network boundaries. Consider pipeline or expert parallelism when model structure better matches those strategies.

## Common failure patterns
Spanning slow links, over-sharding small models, uneven partitioning, assuming linear scaling, and ignoring collective synchronization in tail latency.

## Verification
Confirm all devices contribute balanced work, expected collectives execute, scaling efficiency is measured, and output quality matches the reference model.

## Expected output
A validated tensor-parallel configuration with topology assumptions and measured scaling behavior.

## Stop conditions
Stop when communication dominates compute, topology is unstable, or additional shards increase cost without meeting a required memory or latency goal.