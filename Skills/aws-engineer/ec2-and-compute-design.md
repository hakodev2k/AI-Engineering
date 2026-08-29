# EC2 and Compute Design

## Purpose
Select and operate EC2-based compute with appropriate instance families, scaling, security, resilience, and lifecycle automation.

## When to use
Use when workloads require VMs, custom runtimes, high control, specialized hardware, or migration from on-premises hosts.

## Inputs
CPU/memory profile, storage/network needs, architecture, licensing, availability target, scaling behavior, operating system constraints.

## Context to inspect
AMI pipeline, launch templates, Auto Scaling Groups, instance profiles, EBS, security groups, SSM, placement, metrics, purchase model.

## Core knowledge
Instance choice should follow measured workload characteristics. Immutable images and automated replacement reduce drift. Graviton can improve price/performance when software is compatible.

## Procedure
1. Profile workload resource demands.
2. Choose candidate instance families and architectures.
3. Benchmark representative workloads.
4. Define launch template and hardened image process.
5. Use ASG health checks and replacement rather than manual repair where possible.
6. Configure SSM for administration without inbound SSH/RDP when feasible.
7. Right-size EBS and network performance.
8. Select On-Demand, Savings Plans, or Spot based on interruption tolerance.
9. Add observability and graceful termination handling.

## Decision points
Use EC2 when control or hardware requirements exceed managed/serverless options. Use Spot only for interruptible or resilient work.

## Common failure patterns
Oversized instances, pets not cattle, unmanaged AMIs, static credentials, open admin ports, no termination handling, and ignoring architecture compatibility.

## Verification
Benchmark throughput/latency, test scale-out/in, replacement, patching, and failure recovery.

## Expected output
Compute design, launch configuration, scaling policy, cost model, and operational runbook.

## Stop conditions
Escalate when licensing, unsupported architecture, or stateful workload behavior prevents safe replacement.