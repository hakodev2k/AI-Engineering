# GPU Cluster Architecture

## Purpose
Design GPU clusters that balance accelerator density, host resources, networking, storage, failure domains, and operability for AI workloads.

## When to use
Use when building or materially changing shared accelerator infrastructure.

## Inputs
Workload classes, accelerator types, node shapes, network/storage capabilities, availability targets, budget.

## Context to inspect
Existing scheduler, rack topology, interconnect, NUMA layout, storage paths, quotas, observability, maintenance model, and cloud/on-prem constraints.

## Core knowledge
Senior design requires understanding PCIe/NVLink/NVSwitch, NUMA, RDMA, oversubscription, failure domains, scheduler placement, host bottlenecks, and heterogeneous hardware compatibility.

## Procedure
1. Characterize workload communication and memory patterns.
2. Define node and accelerator pool shapes.
3. Map topology requirements for distributed jobs.
4. Size host CPU, RAM, local disk, and network bandwidth.
5. Define failure-domain boundaries and spare capacity.
6. Design scheduler labels, taints, affinities, and quotas.
7. Define maintenance and upgrade strategy.
8. Add telemetry for accelerator, host, network, and scheduler health.
9. Benchmark representative workloads before broad adoption.

## Decision points
Dense nodes reduce communication overhead but enlarge failure blast radius. Homogeneous fleets simplify scheduling; heterogeneous fleets may improve cost and supply resilience.

## Common failure patterns
CPU-starved GPU nodes, hidden NUMA penalties, network oversubscription, topology-unaware scheduling, and single-rack concentration.

## Verification
Run distributed training and serving benchmarks, fault tests, topology checks, and utilization reviews.

## Expected output
A documented cluster topology with node pools, placement rules, failure domains, and validated performance envelopes.

## Stop conditions
Stop if network/storage capabilities or workload communication patterns cannot be established.