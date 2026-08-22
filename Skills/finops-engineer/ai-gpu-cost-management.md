# AI and GPU Cost Management

## Purpose
Manage accelerator-heavy AI/ML spend by aligning GPU capacity, model workload characteristics, scheduling, utilization, and service quality.

## When to use
Use for training clusters, inference endpoints, GPU reservations, accelerator shortages, or rapidly growing AI platform costs.

## Inputs
GPU billing, accelerator type, utilization, memory metrics, training/inference workload, queue time, throughput, latency SLOs, model sizes, scheduling data.

## Context to inspect
Inspect GPU duty cycle, memory utilization, batch size, model parallelism, idle reservation, checkpointing, spot/preemptible tolerance, inference concurrency, autoscaling, data pipeline bottlenecks, and commitment terms.

## Core knowledge
GPU cost efficiency depends on useful accelerator work, not allocated GPU-hours alone. CPU/data bottlenecks can strand expensive GPUs. Training and inference have different economics and reliability constraints.

## Procedure
1. Allocate accelerator cost to workloads and owners.
2. Measure GPU utilization, memory, queueing, and useful throughput.
3. Identify idle reservations and non-GPU bottlenecks.
4. Compare accelerator types using cost per useful training/inference unit.
5. Tune batching, concurrency, scheduling, and autoscaling.
6. Evaluate spot/preemptible capacity with checkpoint/retry design.
7. Evaluate model/runtime optimizations when quality permits.
8. Model commitments only for durable baseline demand.
9. Validate latency, quality, and training completion behavior.
10. Track realized cost per token/request/example/job as appropriate.

## Decision points
Use cheaper/preemptible capacity for fault-tolerant training; reserve stable capacity for strict inference latency or scarce supply when justified. Prefer workload efficiency before long commitments.

## Common failure patterns
Measuring only GPU allocation, ignoring CPU/data starvation, buying commitments for experimental demand, reducing model precision without quality validation, and optimizing dollars while queue time explodes.

## Verification
Useful throughput/unit cost improves; model quality and SLOs remain acceptable; interruption recovery works; billing confirms savings.

## Expected output
An accelerator cost profile, workload efficiency findings, optimization plan, and verified unit-cost improvement.

## Stop conditions
Escalate when optimization changes model quality, safety behavior, or production latency beyond approved thresholds.