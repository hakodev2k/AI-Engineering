# Hardware Accelerator Selection

## Purpose
Match AI workloads to accelerator and system configurations that meet performance, capacity, availability, and cost objectives.

## When to use
For new deployments, capacity expansion, model upgrades, or hardware migration.

## Inputs
Model workload, precision, memory footprint, traffic, SLOs, candidate hardware, interconnect, cloud/on-prem pricing and availability.

## Preconditions
Use deployable hardware configurations and comparable software stacks.

## Context to inspect
Inspect compute capability, memory capacity/bandwidth, interconnect, supported dtypes/kernels, CPU/network bottlenecks, power, topology, and supply constraints.

## Core knowledge
Peak FLOPS rarely predict service performance alone. Memory bandwidth/capacity, interconnect, kernel support, topology, and utilization determine delivered economics.

## Procedure
1. Translate workload into memory, compute, bandwidth, and latency needs.
2. Eliminate incompatible candidates.
3. Benchmark representative model/runtime combinations.
4. Sweep concurrency and batch sizes.
5. Measure utilization, power where relevant, memory, and tail latency.
6. Evaluate scale-up/scale-out behavior.
7. Calculate cost per useful request/token/job at target SLO.
8. Include availability and operational constraints.
9. Test degraded/failure modes for distributed setups.
10. Record sensitivity to workload growth.

## Decision points
Prefer fewer larger accelerators when model fit/interconnect dominates; scale out when parallelism and availability economics justify it.

## Common failure patterns
Buying by peak specs, ignoring host/network limits, comparing different quality/precision, assuming linear scaling, and excluding idle capacity from cost.

## Verification
Target workload meets SLO and capacity with measured cost and headroom on the chosen production-equivalent system.

## Expected output
Hardware recommendation, benchmark matrix, capacity model, cost model, and scaling assumptions.

## Stop conditions
Stop when pricing/availability or production-equivalent hardware is too uncertain for a defensible decision.