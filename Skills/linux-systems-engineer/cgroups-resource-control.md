# cgroups and Resource Control

## Purpose
Control and diagnose Linux workload resource consumption using cgroups without causing hidden throttling or starvation.

## When to use
Use for service isolation, noisy-neighbor issues, container limits, CPU/memory throttling, or host consolidation.

## Inputs
Workload SLOs, CPU/memory/I/O demand, cgroup hierarchy/version, service/container manager, and capacity baseline.

## Context to inspect
Inspect cgroup v1/v2, systemd slices, container runtime ownership, CPU quotas/weights, memory limits, swap, OOM behavior, I/O controls, and PSI.

## Core knowledge
Understand hierarchical accounting, hard limits vs weights, CPU quota throttling, memory.high/max, OOM scope, I/O controls, and interaction with systemd/container orchestrators.

## Procedure
1. Map workload processes to their actual cgroups.
2. Capture demand, limits, throttling, OOM, and PSI evidence.
3. Determine whether contention is host-wide or policy-induced.
4. Translate workload priority/SLO into resource policy.
5. Prefer weights for proportional sharing and hard limits for true ceilings.
6. Configure through the owning manager rather than ad hoc filesystem edits.
7. Test under contention and normal load.
8. Monitor throttling, latency, and headroom.

## Decision points
Use hard CPU quotas only when ceilings are required; weights when spare capacity should remain usable. Set memory limits with working-set and failure-mode evidence.

## Common failure patterns
Limits below working set, diagnosing container metrics without host context, editing transient cgroups manually, confusing quota with CPU count, and ignoring ancestor limits.

## Verification
Resource policy persists, workload meets SLOs, throttling/OOM behavior is intentional, and neighboring workloads remain protected.

## Expected output
Documented resource policy, measured trade-offs, and verification evidence.

## Stop conditions
Stop if changes affect shared production capacity without owner agreement or workload demand cannot be characterized safely.