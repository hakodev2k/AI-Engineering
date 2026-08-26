# GPU Security and Multi-Tenant Hardening

## Purpose
Reduce security risk at GPU device, runtime, container, scheduler, and workload-sharing boundaries.

## When to use
Use for shared accelerator platforms, untrusted workloads, container deployments, device passthrough, or security reviews.

## Inputs
Threat model, tenant model, runtime/container configuration, device permissions, scheduler policy, driver versions, network/storage access.

## Preconditions
Define trust boundaries and required isolation before selecting sharing mechanisms.

## Context to inspect
Inspect device-node permissions, privileged capabilities, host driver exposure, container runtime hooks, IPC/shared memory, debugging/profiling access, partitioning, peer access, secrets, images, and scheduler controls.

## Core knowledge
GPU workloads cross a privileged host driver boundary. Sharing can expose side channels or residual resource risks depending on hardware/software. Least privilege, supported isolation, patched drivers, signed/trusted artifacts, and workload identity remain essential.

## Procedure
1. Model assets, tenants, trust boundaries, and attack surfaces.
2. Inventory device/runtime privileges granted to workloads.
3. Remove unnecessary host capabilities and device access.
4. Use supported hardware partitioning/isolation where requirements demand it.
5. Restrict profiling/debug interfaces in untrusted environments.
6. Harden container images and dependency provenance.
7. Isolate secrets from images, logs, and device-visible buffers where practical.
8. Patch drivers/runtimes through controlled rollout.
9. Test tenant separation and policy enforcement.
10. Monitor privileged access and anomalous device usage.

## Decision points
Prefer exclusive or hardware-partitioned devices for stronger tenant isolation. Use time sharing only when threat model permits. Grant profiling access narrowly because it can expose sensitive execution information.

## Common failure patterns
Privileged containers by default, broad device mounts, stale drivers, shared IPC namespaces, secrets embedded in images, assuming containers equal hardware isolation, and undocumented debug access.

## Verification
Verify least-privilege permissions, tenant escape tests appropriate to scope, image/dependency scanning, policy enforcement, patch state, and audit visibility.

## Expected output
A threat model, hardened configuration, documented residual risks, and verified isolation controls.

## Stop conditions
Stop and escalate when isolation requirements exceed supported hardware/runtime guarantees, a suspected vulnerability is active, or changes affect regulated/security-critical boundaries without approval.