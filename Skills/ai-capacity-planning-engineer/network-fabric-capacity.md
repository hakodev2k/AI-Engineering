# Network Fabric Capacity Planning

## Purpose
Plan east-west and north-south network capacity for distributed AI training and inference without treating accelerator count as the only bottleneck.

## When to use
Use for multi-node training, disaggregated inference, storage-heavy pipelines, cluster expansion, or unexplained accelerator underutilization.

## Inputs
Collective traffic, node topology, interconnect bandwidth, oversubscription, storage traffic, model parallelism, utilization traces, failure-domain design.

## Preconditions
Topology and traffic paths are documented.

## Context to inspect
NICs, switches, RDMA, InfiniBand/Ethernet, NCCL behavior, rack boundaries, cross-zone links, storage network, QoS.

## Core knowledge
Distributed AI performance depends on effective bandwidth, latency, topology locality, and collective patterns. Nominal link speed does not equal application throughput.

## Procedure
1. Map communication paths for major workloads.
2. Measure real collective and storage throughput.
3. Identify oversubscribed links and cross-rack traffic.
4. Model peak concurrent jobs.
5. Include failover routing.
6. Align scheduler placement with topology.
7. Size uplinks and fabric headroom.
8. Validate with representative distributed benchmarks.

## Decision points
Prefer topology-aware scheduling before expensive fabric expansion when poor placement is dominant. Separate storage and training traffic when contention materially harms SLOs.

## Common failure patterns
Planning from port speed, ignoring collective patterns, omitting failover traffic, and assuming idle GPU means enough network capacity.

## Verification
Representative jobs sustain expected scaling efficiency during normal and degraded topology states.

## Expected output
A fabric capacity model with bottlenecks, headroom, and expansion triggers.

## Stop conditions
Escalate when network telemetry cannot identify hot paths or topology is undocumented.