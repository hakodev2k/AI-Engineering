# Runtime User Rules

## Purpose
Minimize the impact of container compromise by constraining runtime identity and privilege.

## Scope
Applies to image users, container runtime users, UID/GID assignment, file ownership, and service accounts inside containers.

## MUST
- Production workloads MUST run as a non-root user unless root is technically required and explicitly approved.
- Runtime UID/GID behavior MUST be deterministic enough to preserve filesystem and access-control expectations.
- Files and directories required by the process MUST have the minimum ownership and permissions needed at runtime.
- Orchestrator security context settings MUST enforce the intended non-root execution model where supported.
- Workloads that temporarily require elevated initialization MUST separate that phase from steady-state runtime privilege when practical.

## MUST NOT
- MUST NOT rely on a Dockerfile user declaration alone when the orchestrator can override runtime identity.
- MUST NOT grant broad writable access to system paths merely to avoid permission troubleshooting.
- MUST NOT run as privileged root by default for convenience.

## SHOULD
- Use numeric non-root identities where cross-environment name resolution is unreliable.
- Prefer read-only root filesystems with explicit writable mounts.

## Exceptions
Root execution requires documented technical necessity, reduced capabilities, isolation controls, risk review, and explicit approval.

## Verification
Inspect image metadata, runtime manifests, effective UID/GID, filesystem permissions, admission policy, and runtime telemetry.