# Distributed Inference Parallelism

## Purpose
Design tensor, pipeline, expert, or other distributed inference layouts when a model cannot be served efficiently on one accelerator.

## When to use
Use for very large models, memory-constrained deployments, or when single-device throughput is insufficient and scale-up has been exhausted.

## Inputs
Model architecture, layer sizes, interconnect topology, GPU memory, runtime support, latency targets, and replica requirements.

## Preconditions
Confirm single-device or simpler deployment is infeasible or materially worse before introducing distributed inference.

## Context to inspect
Tensor parallel degree, pipeline stages, expert parallelism, collective communication, NVLink/NVSwitch/PCIe/network topology, process placement, and failure semantics.

## Core knowledge
Parallelism trades memory feasibility for communication and coordination overhead. Topology-aware placement is critical; poorly placed ranks can erase compute gains and amplify tail latency.

## Procedure
1. Measure single-device feasibility and bottlenecks.
2. Determine minimum parallel degree required for memory.
3. Map model structure to supported parallel strategies.
4. Place communication-heavy ranks on the fastest interconnect.
5. Benchmark multiple parallel degrees.
6. Measure communication/computation overlap.
7. Test process and device failure behavior.
8. Compare latency, throughput, and cost per request.
9. Document topology constraints and replacement procedures.

## Decision points
Prefer the smallest parallel group that meets memory and SLO requirements; retain more independent replicas when availability and throughput benefit outweighs larger groups.

## Common failure patterns
Ignoring interconnect topology, maximizing GPU count without benchmarking, treating distributed group failure as single-GPU failure, and no placement controls.

## Verification
Load tests show stable collectives, target SLOs, predictable failure behavior, and measurable benefit over simpler alternatives.

## Expected output
A validated parallelism topology with placement rules, performance evidence, and operational constraints.

## Stop conditions
Stop when communication overhead or failure-domain growth makes the layout worse than a simpler model/hardware option.