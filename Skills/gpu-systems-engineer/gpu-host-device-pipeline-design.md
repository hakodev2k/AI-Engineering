# GPU Host-Device Pipeline Design

## Purpose
Build balanced CPU-to-GPU pipelines that keep accelerators supplied without uncontrolled queuing or transfer overhead.

## When to use
Use when GPU idle time is caused by input preparation, launch overhead, serialization, transfers, or output processing.

## Inputs
End-to-end trace, CPU profile, data sizes, transfer rates, queue depths, preprocessing code, latency/SLO targets.

## Preconditions
Measure the whole request/job path rather than GPU kernels alone.

## Context to inspect
Inspect parsing, preprocessing, batching, memory pinning, NUMA placement, copies, queueing, launch cadence, callbacks, postprocessing, backpressure, and thread/process scheduling.

## Core knowledge
Accelerator throughput depends on upstream supply. Batching amortizes overhead but increases queue latency and memory. Pinned memory accelerates transfers but consumes scarce host resources. Asynchronous pipelines require explicit ownership and backpressure.

## Procedure
1. Trace one unit of work from input to completed output.
2. Quantify CPU, queue, transfer, GPU, and postprocessing time.
3. Locate accelerator starvation and queue buildup.
4. Remove unnecessary serialization/copies.
5. Choose bounded batching from SLO and throughput evidence.
6. Pin and place host memory only for transfer-critical paths.
7. Pipeline independent stages with explicit ownership.
8. Add backpressure and bounded queues.
9. Align CPU/NIC/GPU placement with NUMA/topology.
10. Load-test steady state and bursts.

## Decision points
Batch when amortized launch/compute benefits exceed queue latency. Use processes versus threads based on runtime, isolation, and CPU characteristics. Prefer bounded buffering over maximizing instantaneous GPU occupancy.

## Common failure patterns
Unbounded queues, excessive pinning, CPU oversubscription, synchronous copies hidden in helpers, tiny launches, NUMA-crossing transfers, latency collapse under batching, and throughput tests that ignore tail latency.

## Verification
Verify GPU idle gaps, CPU utilization, transfer overlap, queue depth, memory, throughput, p95/p99 latency, and overload behavior.

## Expected output
A balanced pipeline design with bounded queues, explicit stage ownership, and measured end-to-end improvement.

## Stop conditions
Stop when upstream data semantics are unknown, workload/SLO is unavailable, host resource limits cannot be observed, or proposed concurrency would violate isolation requirements.