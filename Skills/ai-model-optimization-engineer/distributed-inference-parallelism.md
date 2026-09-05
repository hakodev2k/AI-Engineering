# Distributed Inference Parallelism

## Purpose
Partition inference across devices/nodes when a model or target throughput cannot be served efficiently on one accelerator.

## When to use
For models exceeding device memory or workloads requiring multi-device capacity.

## Inputs
Model architecture, device memory, topology, interconnect, runtime, workload, SLOs, baseline.

## Preconditions
Prove single-device optimization is insufficient or infeasible.

## Context to inspect
Inspect tensor, pipeline, expert, and data parallel options; communication volume; layer balance; topology; failure domains; and scheduler support.

## Core knowledge
Parallelism introduces communication and synchronization. Tensor parallelism is latency-sensitive to interconnect; pipeline parallelism can create bubbles; expert parallelism depends on routing balance.

## Procedure
1. Quantify why one device is insufficient.
2. Map model structure and communication requirements.
3. Choose candidate parallelism dimensions.
4. Align placement with physical topology.
5. Benchmark communication and compute overlap.
6. Measure latency, throughput, memory, and scaling efficiency.
7. Test skewed/long requests and expert imbalance where relevant.
8. Exercise device/node failure behavior.
9. Tune partition sizes and scheduler.
10. Compare against alternative hardware/model optimization.

## Decision points
Use the minimum parallel degree that meets fit/SLO needs. Favor data parallel replicas when the model fits and throughput, not single-request latency, is the objective.

## Common failure patterns
Assuming linear scaling, crossing slow links unnecessarily, unbalanced stages, hidden collective synchronization, and ignoring failure blast radius.

## Verification
Measured scaling efficiency and SLO compliance justify additional devices and operational complexity.

## Expected output
Parallelism topology, placement/configuration, scaling benchmarks, capacity limits, and failure behavior.

## Stop conditions
Stop when communication overhead eliminates benefit or topology/runtime cannot support the required partition safely.