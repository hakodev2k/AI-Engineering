# Distributed Training Strategy

## Purpose
Design data, tensor, pipeline, sequence, and sharding parallelism for efficient and reliable large-model training.

## When to use
Use when a model cannot train efficiently on one accelerator or when scaling to multi-node clusters.

## Inputs
Model config, sequence length, global batch target, accelerator memory, node topology, interconnect bandwidth, framework capabilities, checkpoint requirements.

## Context to inspect
Parameter/optimizer/activation memory, collective communication patterns, network topology, kernel support, data-loader throughput, and prior scaling curves.

## Core knowledge
Parallelism trades memory for communication and scheduling complexity. The best layout is topology-aware. High theoretical FLOPs do not matter if collectives, bubbles, input stalls, or memory pressure dominate.

## Procedure
1. Build a per-rank memory budget.
2. Establish single-node throughput baseline.
3. Select data parallelism and optimizer sharding level.
4. Add tensor/sequence parallelism when model layers exceed efficient local execution.
5. Add pipeline parallelism only when needed and size microbatches to control bubbles.
6. Map communication-heavy groups to fastest links.
7. Validate global batch and gradient semantics.
8. Measure strong/weak scaling efficiency.
9. Profile collective time, idle time, and input stalls.
10. Document topology and launch configuration.

## Decision points
Prefer simpler parallelism until memory or throughput evidence requires complexity. Trade recomputation against memory before adding communication-heavy sharding. Use pipeline parallelism when stage partitioning is balanced and bubbles are acceptable.

## Common failure patterns
Topology-blind rank placement; hidden global-batch changes; too-small microbatches; network oversubscription; comparing throughput at different sequence lengths.

## Verification
Measured memory fits margin, gradients match a reference configuration, tokens/sec scales acceptably, and profiles identify no unexplained communication bottleneck.

## Expected output
A reproducible distributed layout, launch config, scaling report, and resource envelope.

## Stop conditions
Stop on silent numerical mismatch, repeated collective failures, unsafe memory margin, or scaling efficiency below the agreed threshold without understood cause.