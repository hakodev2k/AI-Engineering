# Distributed Inference

## Purpose
Design and tune multi-device inference when a model or workload exceeds the efficient capacity of one accelerator.

## When to use
Use for very large models, strict latency targets requiring parallelism, or throughput goals that justify multi-GPU coordination.

## Inputs
Model topology, layer sizes, hardware interconnect, runtime parallelism support, latency targets, batch sizes, and failure-domain constraints.

## Context to inspect
Inspect tensor, pipeline, expert, and data parallel options; interconnect bandwidth; collective operations; partition balance; synchronization; and topology placement.

## Core knowledge
Distributed inference trades memory and compute parallelism against communication overhead and synchronization. Fast intra-node links can make tensor parallelism viable; slower cross-node links often punish fine-grained collectives.

## Procedure
1. Determine whether one device can meet memory and latency requirements.
2. Profile layer compute and communication volume.
3. Map candidate parallelism strategies to hardware topology.
4. Start with the smallest degree of parallelism that fits.
5. Measure collective and synchronization time.
6. Check partition balance and idle device time.
7. Tune microbatching or pipeline stages where applicable.
8. Keep high-communication groups on fast interconnects.
9. Test node/device loss and restart behavior.
10. Compare total cost and latency against simpler scale-out replicas.

## Decision points
Prefer data-parallel replicas when the model fits one device. Use tensor parallelism for low-latency model partitioning on fast links. Use pipeline or expert partitioning when model structure and workload justify their scheduling complexity.

## Common failure patterns
Splitting across nodes without measuring link costs, excessive parallelism, imbalanced partitions, topology-unaware placement, and treating theoretical linear scaling as achievable.

## Verification
Verified means representative tests show the distributed topology beats viable simpler alternatives on the target objective while meeting correctness and resilience requirements.

## Expected output
Parallelism topology, placement constraints, communication profile, benchmark results, and recovery behavior.

## Stop conditions
Escalate when required topology is unavailable, collectives are unstable, or cross-node communication makes the target SLO infeasible.