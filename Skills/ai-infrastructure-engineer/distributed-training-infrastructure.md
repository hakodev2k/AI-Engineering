# Distributed Training Infrastructure

## Purpose
Provide reliable infrastructure for multi-node training with efficient collective communication, checkpointing, and job recovery.

## When to use
Use for workloads that exceed one accelerator or require coordinated multi-node execution.

## Inputs
Training framework, model size, parallelism strategy, node topology, network, storage, checkpoint requirements.

## Context to inspect
Launcher, rendezvous mechanism, NCCL/RDMA settings, scheduler placement, network MTU, storage bandwidth, failure behavior, and job logs.

## Core knowledge
Senior operation requires understanding data/tensor/pipeline parallelism, collective communication, rank coordination, topology, stragglers, checkpoint consistency, and restart semantics.

## Procedure
1. Establish single-node baseline correctness and throughput.
2. Select the parallelism strategy from model and memory constraints.
3. Require topology-aware node placement.
4. Validate RDMA/collective communication paths.
5. Size checkpoint storage and write bandwidth.
6. Configure retry and rendezvous behavior deliberately.
7. Instrument per-rank utilization, communication, and straggler metrics.
8. Test node loss and restart from checkpoint.
9. Compare scaling efficiency as node count increases.

## Decision points
Scale out only while marginal throughput justifies communication overhead. Prefer frequent checkpoints for expensive long jobs, balanced against storage and pause cost.

## Common failure patterns
Cross-zone placement, silent fallback to slow networking, mismatched library/driver versions, checkpoint bottlenecks, and treating stragglers as GPU shortages.

## Verification
Measure scaling efficiency, collective bandwidth, checkpoint recovery, and deterministic restart behavior.

## Expected output
A validated distributed-training runtime and operational runbook.

## Stop conditions
Stop when framework compatibility, network capabilities, or checkpoint semantics are unknown.