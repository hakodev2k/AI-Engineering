# Rootless Containers

## Purpose
Design and diagnose unprivileged container execution that reduces daemon/runtime privilege without silently weakening functionality or isolation.

## When to use
Use for rootless runtime support, developer environments, multi-tenant hosts, or privilege-reduction reviews.

## Inputs
User/group mappings, subordinate ID ranges, kernel settings, filesystem/network requirements, OCI spec, runtime logs.

## Context to inspect
Inspect user namespaces, `/etc/subuid`, `/etc/subgid`, helper binaries, cgroup delegation, storage driver, networking backend, and device requirements.

## Core knowledge
Rootless containers rely heavily on user namespaces and delegated host facilities. Apparent root inside a user namespace is not host root. Networking, cgroups, privileged ports, filesystems, and devices can require alternative implementations.

## Procedure
1. Define required workload capabilities.
2. Confirm kernel and subordinate-ID support.
3. Validate UID/GID mapping ranges and ownership.
4. Check cgroup v2 delegation.
5. Select a rootless-compatible storage strategy.
6. Validate networking and port exposure.
7. Remove unnecessary capabilities and host access.
8. Test bind mounts with mapped ownership.
9. Test restart, exec, signals, and cleanup.
10. Compare security properties with privileged mode.

## Decision points
Choose rootless by default where workload constraints allow it. Escalate narrowly for devices/network features rather than converting the whole runtime to privileged execution.

## Common failure patterns
Insufficient subordinate IDs, unmapped file ownership, assuming host networking parity, cgroup permission failures, privileged helper sprawl, and treating rootless as a complete sandbox.

## Verification
Run functional tests as an unprivileged account, inspect mappings and capabilities, and prove no unexpected host-root process or writable host path is required.

## Expected output
A rootless runtime configuration with documented limitations and security evidence.

## Stop conditions
Stop when workload requirements inherently require host privilege and no approved narrow delegation exists.