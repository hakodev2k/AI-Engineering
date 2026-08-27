# Linux Namespaces

## Purpose
Engineer and troubleshoot container isolation based on Linux namespaces while preserving correct host and workload semantics.

## When to use
Use for runtime namespace creation, joining, debugging, rootless execution, or isolation review.

## Inputs
OCI spec, process tree, namespace links under `/proc`, kernel version, runtime logs, and required sharing model.

## Context to inspect
Inspect user, mount, PID, network, IPC, UTS, cgroup, and time namespace usage; identify which namespaces are created, inherited, or joined.

## Core knowledge
Namespaces isolate views, not resources by themselves. User namespaces remap credentials; mount propagation affects host/container visibility; PID namespaces change process identity and reaping; namespace file descriptors preserve lifetime.

## Procedure
1. Establish the intended isolation and sharing model.
2. Compare intended namespaces with the generated runtime spec.
3. Inspect the target process namespace identities.
4. Validate creation/join ordering, especially user and mount namespaces.
5. Check UID/GID mappings and privilege transitions.
6. Validate mount propagation and pivot/chroot behavior.
7. Confirm PID 1 responsibilities and signal flow.
8. Test namespace lifetime after parent/runtime exit.
9. Exercise exec into existing namespaces.
10. Add regression tests for shared and isolated configurations.

## Decision points
Share a namespace only for a concrete communication/observability requirement. Prefer user namespaces/rootless modes when compatible, but account for filesystem and device limitations.

## Common failure patterns
Assuming namespaces imply security alone, incorrect mount propagation, broken UID mappings, joining the wrong namespace, leaking namespace FDs, and mishandling PID 1.

## Verification
Compare `/proc/<pid>/ns/*`, mappings, mount tables, process visibility, and network behavior against requirements. Verify cleanup after crashes.

## Expected output
A namespace configuration or diagnosis with explicit sharing, mappings, and evidence.

## Stop conditions
Stop if required kernel features are unavailable, host namespace modification is unsafe, or identity mappings cannot be proven correct.