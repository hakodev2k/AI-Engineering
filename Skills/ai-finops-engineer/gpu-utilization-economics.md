# GPU Utilization Economics

## Purpose
Diagnose the economic efficiency of GPU and accelerator fleets by connecting utilization, throughput, queueing, memory use, and idle capacity to actual cost.

## When to use
Use when accelerator spend is high, clusters appear underutilized, jobs wait despite spare capacity, or teams request more GPUs. Do not optimize only for average GPU utilization without considering memory pressure, communication, and throughput.

## Inputs
- GPU utilization, memory, power, and occupancy metrics
- Scheduler and queue metrics
- Job runtime and throughput data
- Instance pricing and commitment terms
- Cluster topology and workload placement

## Context to inspect
Inspect accelerator SKU, node configuration, MIG/partitioning, scheduling policy, distributed-training topology, inference batching, utilization distributions, failed jobs, preemption, and idle reservations.

## Core knowledge
A GPU can be expensive even when percentage utilization looks high if throughput is poor. Economic efficiency is best assessed with business-relevant output per cost unit: samples/sec/$, tokens/sec/$, requests/$, or successful training progress/$.

## Procedure
1. Establish workload-specific economic throughput metrics.
2. Segment usage by training, inference, experimentation, and idle capacity.
3. Compare billed accelerator-hours with active productive hours.
4. Inspect p50/p95 utilization rather than only averages.
5. Identify memory-bound, compute-bound, I/O-bound, and synchronization-bound workloads.
6. Quantify queue wait and fragmentation.
7. Evaluate partitioning, bin-packing, autoscaling, and right-sizing opportunities.
8. Compare alternative accelerator SKUs using measured workload throughput.
9. Include engineering effort and reliability risk in savings estimates.
10. Prioritize changes by annualized savings and confidence.
11. Re-measure after changes using the same workload baseline.

## Decision points
- Prefer smaller GPUs when memory and throughput requirements permit.
- Prefer partitioning when workloads are consistently small and isolation is acceptable.
- Prefer dedicated capacity for latency-sensitive or tightly coupled distributed jobs.
- Scale out only when communication overhead does not erase economics.

## Common failure patterns
- Chasing utilization percentages instead of useful throughput.
- Ignoring CPU, storage, and network bottlenecks.
- Comparing SKUs from list price alone.
- Leaving failed or stalled jobs consuming accelerators.
- Over-reserving capacity for rare peaks.

## Verification
Show before/after cost per useful output, queue time, failure rate, and throughput. Confirm savings in billing data, not only telemetry.

## Expected output
A utilization economics report with bottlenecks, quantified waste, recommended changes, expected savings, and validation metrics.

## Stop conditions
Stop when telemetry is too coarse to distinguish active from idle work, proposed changes threaten workload correctness, or capacity commitments prevent near-term savings.