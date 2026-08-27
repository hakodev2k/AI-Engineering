# Device Access and Isolation

## Purpose
Grant containers controlled access to host devices while preserving least privilege, cgroup policy, namespace correctness, and operational safety.

## When to use
Use for GPU, accelerator, block/character device, FUSE, or specialized hardware integration.

## Inputs
Device nodes, major/minor numbers, OCI device/resources config, ownership, driver/runtime requirements, security policy.

## Context to inspect
Inspect device discovery, node creation/bind mounting, cgroup device controls where applicable, capabilities, LSM policy, user mappings, and hot-plug behavior.

## Core knowledge
A device node is an interface to a kernel driver, not ordinary data. Exposing broad devices can bypass container isolation. Dynamic device managers may require explicit lifecycle integration.

## Procedure
1. Identify exact device functions required.
2. Resolve stable device identity rather than relying only on path.
3. Inspect permissions, ownership, driver, and namespace constraints.
4. Grant only required device nodes and operations.
5. Validate cgroup/security policy.
6. Test rootless/user-namespace behavior if relevant.
7. Exercise hot unplug, driver reset, and container restart.
8. Ensure teardown removes runtime-created nodes/mounts.
9. Add audit/telemetry for device assignment.
10. Document exclusivity or sharing semantics.

## Decision points
Prefer mediated vendor/device plugins for complex accelerators. Direct device exposure is suitable only when the kernel/driver isolation model is understood.

## Common failure patterns
Using `--privileged`, exposing `/dev` wholesale, unstable device paths, mismatched UID/GID, stale assignments, and assuming driver faults are container-local.

## Verification
Prove required device operations work and unrelated devices remain inaccessible; test lifecycle and failure recovery.

## Expected output
A least-privilege device assignment design with evidence.

## Stop conditions
Stop when device access could permit host compromise or sharing semantics are undefined.