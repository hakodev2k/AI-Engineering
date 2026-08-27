# Checkpoint and Restore

## Purpose
Design and validate container checkpoint/restore workflows, including process, memory, namespace, filesystem, network, and external-resource compatibility.

## When to use
Use for migration, fast restart, suspend/resume, or CRIU-style runtime integration.

## Inputs
Runtime/CRIU versions, kernel features, OCI spec, process tree, mounts, network state, devices, checkpoint artifacts, workload constraints.

## Context to inspect
Identify resources that can be serialized versus external dependencies requiring reattachment or policy. Inspect namespaces, sockets, files, timers, devices, cgroups, and security context.

## Core knowledge
Checkpointing captures process state but cannot transparently serialize every kernel/external resource. Restore compatibility depends on kernel/runtime features, filesystem identity, network semantics, CPU capabilities, and security policy.

## Procedure
1. Define supported workload and migration boundaries.
2. Inventory process and external resources.
3. Check kernel/runtime feature compatibility.
4. Quiesce workload where consistency requires it.
5. Create checkpoint with explicit artifact ownership/protection.
6. Validate artifact completeness and integrity.
7. Prepare target namespaces, mounts, cgroups, networking, and identities.
8. Restore and reconnect external resources.
9. Verify application-level consistency, not just process survival.
10. Test rollback when restore fails.
11. Exercise version/host compatibility matrix.

## Decision points
Use live migration only when downtime requirements justify complexity. Prefer application-level replication for state that cannot be restored reliably.

## Common failure patterns
Assuming open connections survive, incompatible kernel features, stale filesystem paths, insecure checkpoint images containing memory secrets, and no rollback.

## Verification
Compare pre/post application state, network behavior, process tree, resource controls, and data integrity; repeat under failure injection.

## Expected output
A bounded checkpoint/restore capability with compatibility and security guarantees.

## Stop conditions
Stop when checkpoint artifacts cannot be protected or external resource consistency cannot be established.