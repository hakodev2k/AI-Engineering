# Model Parallelism

## Purpose
Select and validate tensor, pipeline, data, and expert parallelism for serving models that exceed single-device capacity or performance targets.

## When to use
Use when a model cannot fit on one accelerator or measured latency/throughput requires multi-device execution.

## Inputs
Model architecture, weight size, hardware topology, interconnect bandwidth, runtime support, SLOs, workload profile.

## Context to inspect
GPU/NPU topology, NUMA placement, NVLink/PCIe/network paths, runtime collective libraries, shard format, scheduler, and failure behavior.

## Core knowledge
Tensor parallelism adds collectives within layers; pipeline parallelism introduces stage bubbles; data parallelism replicates weights; expert parallelism redistributes MoE experts. Communication can dominate gains, so topology-aware placement is mandatory.

## Procedure
1. Establish single-device or minimum-shard baseline. 2. Determine memory minimum. 3. Map physical interconnect topology. 4. Benchmark candidate parallelism degrees. 5. Measure compute/communication overlap and collective time. 6. Validate shard loading and deterministic model identity. 7. Test uneven requests and long contexts. 8. Test device/process failure. 9. Select the lowest-complexity configuration meeting SLOs. 10. Document topology constraints.

## Decision points
Prefer data parallel replicas when the model fits and throughput is the goal. Use tensor parallelism when memory or per-request compute requires it. Add pipeline/expert parallelism only with measured benefit.

## Common failure patterns
Ignoring topology, spanning slow links unnecessarily, assuming linear scaling, mismatched shards, and increasing parallel degree while reducing effective replica count.

## Verification
Compare latency, tokens/sec, communication overhead, memory headroom, and failure recovery across candidate configurations.

## Expected output
A topology-aware parallelism plan with benchmark evidence and operational constraints.

## Stop conditions
Stop if hardware topology is unknown, runtime/model parallelism is unsupported, or shard integrity cannot be verified.