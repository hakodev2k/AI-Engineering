# Tensor and Pipeline Parallelism

## Purpose
Choose and validate multi-GPU model partitioning when a model does not fit or single-device throughput is inadequate.

## When to use
Use for large models, multi-GPU nodes, distributed serving, or communication-related regressions.

## Inputs
Model topology, GPU memory, interconnect topology, runtime support, traffic profile, and latency targets.

## Context to inspect
Layer shapes, attention heads, collective operations, NVLink/PCIe/network topology, placement, process mapping, and failure behavior.

## Core knowledge
Tensor parallelism adds frequent collectives; pipeline parallelism adds stage boundaries and bubbles. More devices can reduce per-device memory while increasing communication and coordination overhead. Topology-aware placement is essential.

## Procedure
1. Determine why parallelism is needed: fit, throughput, or latency.
2. Benchmark the smallest feasible device count first.
3. Map candidate tensor-parallel degrees to model divisibility constraints.
4. Keep high-frequency collectives on the fastest available interconnect.
5. Evaluate pipeline stages only when model/runtime characteristics justify them.
6. Measure communication time, idle time, memory balance, TTFT, and decode latency.
7. Test process/device failure and restart behavior.
8. Compare cost per useful token across configurations.
9. Document topology requirements in deployment constraints.

## Decision points
Prefer tensor parallelism within a high-bandwidth node; scale replicas for throughput when the model already fits. Use pipeline parallelism cautiously for latency-sensitive serving.

## Common failure patterns
Assuming linear speedup, spanning slow links accidentally, uneven memory placement, excessive parallel degree, and ignoring collective contention.

## Verification
Profile collectives and kernels, verify device placement, and load-test the selected configuration against a smaller baseline.

## Expected output
A measured parallelism configuration, topology contract, and fallback plan.

## Stop conditions
Escalate if hardware topology cannot meet the communication requirement or runtime partitioning is incompatible with the model.