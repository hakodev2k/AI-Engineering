# Training Cluster Capacity Planning

## Purpose
Plan accelerator, storage, network, checkpoint, and scheduling capacity for model training and fine-tuning workloads.

## When to use
Use before large training runs, annual planning, cluster expansion, or when training queues and completion times become unacceptable.

## Inputs
Training jobs, model sizes, dataset sizes, GPU-hours, parallelism strategy, checkpoint cadence, storage throughput, network topology, target completion dates, failure rates.

## Preconditions
Representative training profiles and scheduler history are available.

## Context to inspect
Job queue, preemption policy, distributed training framework, data loader behavior, interconnect, object storage, checkpoint storage, maintenance windows.

## Core knowledge
Training capacity is constrained by both accelerator count and gang-scheduling/topology requirements. Idle GPUs may coexist with unschedulable jobs because contiguous nodes, memory, network locality, or reservation constraints are missing.

## Procedure
1. Inventory recurring and planned training workloads.
2. Convert jobs into GPU-hours and topology requirements.
3. Separate flexible batch work from deadline-sensitive runs.
4. Measure queue wait, runtime, failure, and restart overhead.
5. Model peak concurrent gang-scheduled demand.
6. Include checkpoint and dataset I/O capacity.
7. Reserve operational headroom for failures and maintenance.
8. Simulate scheduler utilization and fragmentation.
9. Evaluate preemption and priority policies.
10. Produce base and expansion capacity plans.

## Decision points
Prefer scheduling improvements over hardware growth when fragmentation dominates. Reserve dedicated capacity only when deadlines or isolation justify reduced pooling efficiency.

## Common failure patterns
Using GPU-hours without topology, ignoring failed-run waste, under-sizing storage/network, and assuming queued jobs can consume every free GPU.

## Verification
Compare simulated queue delay and completion times against service objectives using historical job traces.

## Expected output
A training capacity plan covering accelerator pools, topology, I/O, reservations, and queue targets.

## Stop conditions
Escalate when planned model architecture or parallelism is too uncertain to determine topology requirements.