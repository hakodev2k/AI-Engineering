# GPU Capacity Planning

## Purpose
Plan accelerator capacity for training and inference so demand, latency, utilization, and cost targets can be met without chronic overprovisioning.

## When to use
Use for new AI workloads, growth forecasts, cluster expansion, or recurring saturation. Do not use when workload characteristics are still unknown enough to make sizing speculative.

## Inputs
- Model sizes and precision
- Training/inference workload profiles
- Throughput and latency targets
- Concurrency and growth forecasts
- GPU/accelerator inventory and pricing

## Preconditions
Representative benchmarks or production telemetry should exist.

## Context to inspect
Inspect GPU memory use, compute utilization, batching, queue depth, job duration, failure rates, topology, reservation policy, and seasonality.

## Core knowledge
Capacity is constrained by memory, compute, interconnect, host resources, scheduling fragmentation, and service-level objectives. Peak demand and average utilization must be treated separately.

## Procedure
1. Classify workloads by training, batch inference, and online inference.
2. Establish per-workload resource envelopes from evidence.
3. Calculate baseline, peak, and failure-headroom demand.
4. Account for topology and fragmentation losses.
5. Model growth and hardware lead time.
6. Compare reserved, elastic, and heterogeneous capacity options.
7. Define admission-control and prioritization rules.
8. Document assumptions and sensitivity ranges.
9. Validate the plan against observed utilization after rollout.

## Decision points
Favor reserved capacity for predictable sustained demand; elastic capacity for bursty workloads; heterogeneous pools when workload compatibility justifies operational complexity.

## Common failure patterns
- Sizing only by GPU count
- Ignoring HBM constraints
- Assuming 100% schedulable capacity
- Ignoring failover headroom
- Planning from average instead of peak demand

## Verification
Compare forecast versus observed queue time, utilization, OOM rate, SLO compliance, and spend after deployment.

## Expected output
A capacity model with assumptions, headroom, growth scenarios, and scaling triggers.

## Stop conditions
Stop when benchmark evidence is insufficient, hardware availability is unknown, or business SLOs are undefined.