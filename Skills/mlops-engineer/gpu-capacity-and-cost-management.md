# GPU Capacity and Cost Management

## Purpose
Plan and control accelerator capacity so training and inference meet SLOs without excessive idle spend or unreliable resource contention.

## When to use
Use for GPU/accelerator fleets, expensive training workloads, serving capacity planning, quota requests, and cost optimization.

## Inputs
Workload profiles, accelerator types, utilization, queue times, throughput, latency, job duration, failure rates, prices, quotas.

## Preconditions
Representative workload measurements exist.

## Context to inspect
Scheduler, autoscaling, reservations, spot/preemptible supply, topology, memory use, storage/network bottlenecks, and chargeback data.

## Core knowledge
High allocation does not equal useful utilization. Optimize completed useful work per cost while respecting queue and serving SLOs. Accelerator waste often originates in data loading, memory fragmentation, poor batching, or oversized reservations.

## Procedure
1. Classify training and serving demand separately.
2. Measure utilization, memory, throughput, and idle time.
3. Identify non-GPU bottlenecks.
4. Right-size accelerator type and count.
5. Benchmark batching and mixed precision where valid.
6. Define queue and capacity SLOs.
7. Use preemptible capacity only with checkpoint recovery.
8. Set quotas and tenant fairness controls.
9. Forecast peak and baseline demand.
10. Track cost per successful training run and per inference unit.

## Decision points
Reserved vs on-demand vs spot; shared vs dedicated GPU; larger accelerator vs more smaller devices; scale-up vs scale-out.

## Common failure patterns
Provisioning from requested memory rather than measured need, zombie notebooks, idle endpoints, distributed jobs blocked by one node, and cost optimization that increases failure/retry cost.

## Verification
Demonstrate target queue/latency SLOs and lower or justified unit cost across representative demand periods.

## Expected output
Capacity model, right-sizing recommendations, quota policy, cost metrics, and scaling thresholds.

## Stop conditions
Escalate when capacity shortages threaten production SLOs or optimization requires reliability/safety trade-offs outside approved policy.