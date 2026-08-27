# OCI Runtime Architecture

## Purpose
Design and review container-runtime behavior across OCI images, runtime specs, shims, low-level runtimes, and host integration without assuming a specific implementation.

## When to use
Use when adding runtime features, evaluating containerd/CRI-O/runc-style boundaries, or diagnosing lifecycle failures. Do not use as a Kubernetes application-deployment guide.

## Inputs
Repository, runtime configuration, OCI bundle/spec, host kernel/runtime versions, lifecycle logs, and operational requirements.

## Context to inspect
Trace the path from image/content store through unpack/snapshot, runtime spec creation, process launch, shim/supervisor, and cleanup. Identify ownership of state, sockets, namespaces, cgroups, and persisted metadata.

## Core knowledge
OCI Image and Runtime specifications define portable contracts but implementations add lifecycle state and orchestration. Runtime boundaries should minimize privileged surface, make ownership explicit, and tolerate supervisor restarts. Container creation, start, kill, delete, and exec are separate state transitions.

## Procedure
1. Identify the caller and required lifecycle operation.
2. Map components and trust boundaries.
3. Inspect the generated OCI spec rather than assuming defaults.
4. Trace persistent and in-memory state ownership.
5. Validate legal state transitions and idempotency expectations.
6. Check namespace, cgroup, mount, capability, seccomp, and device setup.
7. Analyze shim/runtime process relationships and reaping.
8. Model partial failures between each transition.
9. Define cleanup behavior for abandoned resources.
10. Add structured lifecycle telemetry.
11. Exercise normal, crash, restart, and cancellation paths.
12. Document compatibility assumptions.

## Decision points
Prefer a separate low-level runtime when isolation and ecosystem compatibility matter; embedded execution can reduce process overhead but increases coupling. Persist only state required for recovery; excessive persisted state creates reconciliation problems.

## Common failure patterns
Treating create and start as atomic, leaking mounts or namespaces, stale sockets, orphaned shims, assuming runtime defaults, non-idempotent cleanup, and coupling control-plane availability to container survival.

## Verification
Verify OCI conformance where applicable, lifecycle tests, host-resource cleanup, restart recovery, and process-tree behavior. Implementation is not verified until failure injection leaves no unexplained host state.

## Expected output
A validated runtime design or change with lifecycle evidence, failure semantics, and compatibility notes.

## Stop conditions
Stop for unclear privilege requirements, unsupported kernel/runtime combinations, destructive host changes, or evidence that ownership boundaries cannot be determined safely.