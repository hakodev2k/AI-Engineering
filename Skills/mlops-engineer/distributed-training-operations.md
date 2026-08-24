# Distributed Training Operations

## Purpose
Operate multi-node or multi-accelerator training with predictable performance, failure recovery, resource efficiency, and reproducible configuration.

## When to use
Use when a workload exceeds single-device capacity or distributed execution materially improves training time.

## Inputs
Model architecture, dataset, framework, topology, accelerator type, interconnect, batch strategy, checkpoint policy, cost target.

## Preconditions
Single-device correctness and baseline performance are known.

## Context to inspect
Scheduler, node images, drivers, collectives, network topology, storage throughput, quotas, checkpoint store, and profiler output.

## Core knowledge
Scaling efficiency depends on compute/communication ratio, data loading, synchronization, topology, precision, and failure model. More devices can increase cost without useful speedup.

## Procedure
1. Establish single-device baseline.
2. Choose data/model/pipeline parallelism as needed.
3. Validate numerical equivalence within tolerance.
4. Configure deterministic rank/world discovery.
5. Size batch and optimizer state consciously.
6. Measure collective and input bottlenecks.
7. Implement durable periodic checkpoints.
8. Test worker loss and restart behavior.
9. Measure scaling efficiency and cost per successful run.
10. Set a maximum economically useful scale.

## Decision points
Scale up vs scale out; synchronous vs asynchronous strategies; full vs sharded checkpoints; reserved vs opportunistic capacity.

## Common failure patterns
Assuming linear scaling, checkpoint storms, slow shared storage, version-skewed drivers, rank hangs, OOM after optimizer state growth, and unrecoverable preemption.

## Verification
Compare throughput, convergence, cost, and recovery behavior against baseline under representative scale.

## Expected output
Topology/configuration, scaling measurements, checkpoint strategy, bottleneck evidence, and operating limits.

## Stop conditions
Escalate persistent collective hangs, unexplained numerical divergence, or scale economics worse than simpler execution.