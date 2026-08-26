# GPU Capacity, Scheduling, and Isolation

## Purpose
Allocate GPU capacity to workloads with explicit throughput, latency, fairness, fragmentation, and isolation trade-offs.

## When to use
Use for cluster scheduling, inference placement, shared GPUs, batch queues, capacity planning, or accelerator scarcity.

## Inputs
Demand forecasts, workload profiles, GPU inventory, topology, SLOs, memory needs, scheduler policies, utilization and queue data.

## Preconditions
Classify workloads by resource profile and service criticality rather than treating all GPU requests equally.

## Context to inspect
Inspect memory footprint, compute saturation, duty cycle, topology requirements, preemption tolerance, startup time, partitioning/time-sharing capabilities, quotas, queueing, and tenant trust boundaries.

## Core knowledge
GPU allocation is multi-dimensional. Memory capacity, compute, bandwidth, topology, interconnect, and latency sensitivity matter. Sharing can improve utilization but create interference. Exclusive allocation simplifies isolation but may strand capacity.

## Procedure
1. Inventory GPU types and topology.
2. Profile workload resource envelopes and variability.
3. Define scheduling objectives and SLO priorities.
4. Match workload requirements to compatible GPU classes.
5. Model fragmentation and queueing under expected demand.
6. Choose exclusive, partitioned, or time-shared placement based on interference evidence.
7. Add quotas, priorities, and bounded preemption policies.
8. Test co-location interference.
9. Monitor queue time, stranded capacity, SLOs, and fairness.
10. Reforecast using observed demand.

## Decision points
Use partitioning for stronger resource boundaries when supported and workload sizes fit. Time-share bursty tolerant work when interference is acceptable. Reserve topology-constrained multi-GPU capacity deliberately.

## Common failure patterns
Scheduling only by GPU count, memory OOM after placement, topology-blind multi-GPU jobs, noisy-neighbor tail latency, stranded fragments, priority starvation, and capacity plans based on average utilization.

## Verification
Verify placement constraints, interference tests, queue/SLO behavior, fragmentation, fairness, failure recovery, and peak-demand scenarios.

## Expected output
A capacity model, placement policy, isolation strategy, and measurable scheduling objectives.

## Stop conditions
Stop when workload envelopes or inventory are unknown, tenant isolation requirements are unresolved, or scheduler capabilities cannot enforce the required policy.