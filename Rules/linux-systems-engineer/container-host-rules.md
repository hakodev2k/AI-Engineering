# Container Host Rules

## Purpose
Protect Linux hosts that run containers while keeping responsibilities between host, runtime, orchestrator, and workload explicit.

## Scope
Applies to container runtimes, host namespaces, cgroups, images, storage, networking, privileges, and runtime maintenance.

## MUST
- Container hosts MUST have supported kernel/runtime combinations and a defined patch lifecycle.
- Workloads MUST have resource controls appropriate to prevent one container from exhausting host-critical resources.
- Privileged containers, host namespace sharing, device access, and host-path mounts MUST be treated as elevated host access and explicitly justified.
- Runtime storage and log growth MUST be capacity-managed.
- Host maintenance MUST account for workload evacuation, redundancy, and runtime state.

## MUST NOT
- Container isolation MUST NOT be treated as equivalent to a strong security boundary for hostile workloads without explicit platform design.
- Docker/container runtime sockets MUST NOT be exposed to untrusted users or workloads.
- Runtime cleanup MUST NOT delete unknown volumes, images, or containers on production hosts without ownership and impact verification.

## SHOULD
- Minimize host-installed software beyond runtime and operational agents.
- Prefer rootless or reduced-capability execution where supported.
- Keep runtime configuration managed and consistent across the fleet.

## Exceptions
Elevated container access requires documented necessity, threat impact, scope, compensating controls, owner, and approval.

## Verification
Inspect runtime/kernel versions, cgroup limits, privileged workloads, socket permissions, mounts, storage utilization, runtime configuration, and behavior during host drain/restart.