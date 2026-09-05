# Filesystem and Mount Rules

## Purpose
Prevent container filesystem configuration from exposing host resources, sensitive data, or unnecessary write surfaces.

## Scope
Applies to root filesystems, bind mounts, volumes, device mounts, temporary storage, and host-path access.

## MUST
- Root filesystems SHOULD be read-only unless the application requires runtime writes; required writable locations MUST be explicit.
- Host-path mounts MUST have documented necessity, least-privilege access mode, and security review.
- Sensitive mounts MUST use the narrowest path and access mode required.
- Temporary writable storage MUST have size or lifecycle controls appropriate to the platform.
- Device access MUST be explicitly authorized and limited to required devices.

## MUST NOT
- MUST NOT mount the container runtime socket into ordinary application containers.
- MUST NOT mount the host root filesystem or broad host directories for convenience.
- MUST NOT expose credential stores, SSH directories, or node-level secrets through general-purpose mounts.
- MUST NOT use writable host paths where an isolated volume can satisfy the requirement.

## SHOULD
- Use ephemeral or dedicated volumes for application write paths.
- Apply mount flags and filesystem permissions that reduce execution and privilege risks where supported.

## Exceptions
Host-level access requires documented use case, attack-path analysis, compensating controls, bounded scope, and approval.

## Verification
Inspect deployment manifests, effective mounts, access modes, node configuration, and runtime filesystem tests.