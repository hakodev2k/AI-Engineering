# Cgroup Policy Programs

## Purpose
Implement workload-scoped eBPF policy using cgroup hooks with explicit hierarchy and lifecycle semantics.

## When to use
Use for connect/bind controls, socket policy, network enforcement, or workload attribution tied to cgroups.

## Inputs
Policy rules, cgroup hierarchy, container runtime behavior, identity source, failure policy, kernel support.

## Context to inspect
Inspect cgroup v2/v1 usage, attachment inheritance, runtime-created paths, namespace boundaries, map-based policy distribution, and privilege model.

## Core knowledge
Cgroup identity and hierarchy are dynamic. Attachment semantics and inheritance must align with workload lifecycle; paths alone are fragile identities.

## Procedure
1. Define enforcement point and workload identity semantics.
2. Map runtime lifecycle to cgroup creation/deletion.
3. Select cgroup hook with required context.
4. Design policy maps and atomic update strategy.
5. Define hierarchy inheritance deliberately.
6. Attach/detach with restart reconciliation.
7. Emit auditable decisions without excessive event volume.
8. Test workload churn and policy races.
9. Validate fail-open/fail-closed behavior.

## Decision points
Enforce in kernel only when decision inputs are bounded and locally available. Keep complex identity resolution in user space and publish compact policy state.

## Common failure patterns
Path-based identity assumptions, stale policy after workload deletion, attachment gaps during restart, inconsistent hierarchy semantics, and no audit evidence.

## Verification
Create/delete/move workloads, race policy updates, restart agent, and confirm enforcement and cleanup.

## Expected output
Lifecycle-safe cgroup enforcement with auditable policy semantics.

## Stop conditions
Stop if workload identity cannot be made reliable or required policy inputs cannot be safely represented in kernel state.