# Container Filesystems and Mounts

## Purpose
Build and troubleshoot container root filesystems, bind mounts, overlay filesystems, propagation, and mount lifecycle safely.

## When to use
Use for rootfs preparation, mount failures, leaked mounts, read-only policies, or storage/runtime integration.

## Inputs
OCI mounts, mountinfo, snapshot metadata, filesystem/kernel versions, storage requirements, runtime logs.

## Context to inspect
Inspect rootfs assembly, overlay lower/upper/work directories, bind sources, propagation flags, mount namespace, idmapped mount support, and cleanup ownership.

## Core knowledge
Mount namespaces isolate mount tables but propagation can cross boundaries. OverlayFS has copy-up, whiteout, inode, and filesystem constraints. Rootfs setup should minimize writable surface and avoid host-path ambiguity.

## Procedure
1. Resolve every mount source and destination.
2. Inspect effective mount flags and propagation.
3. Validate rootfs/snapshot state before runtime creation.
4. Check ordering for pseudo-filesystems and masked/read-only paths.
5. Validate bind source type and symlink handling.
6. Exercise copy-up and deletion semantics for layered filesystems.
7. Test read-only rootfs with required writable paths.
8. Simulate runtime crash during setup and teardown.
9. Detect residual mounts after deletion.
10. Document host filesystem dependencies.

## Decision points
Prefer managed volumes/snapshots over arbitrary host binds. Use read-only mounts where mutation is unnecessary; use propagation only when a concrete nested-mount workflow requires it.

## Common failure patterns
Recursive mount leaks, unsafe host binds, incorrect propagation, overlay upper/work mismatch, symlink traversal assumptions, and cleanup after namespace loss.

## Verification
Validate `/proc/*/mountinfo`, filesystem behavior, permissions, crash cleanup, and storage integrity tests.

## Expected output
A safe mount/rootfs configuration or evidence-backed filesystem RCA.

## Stop conditions
Stop for destructive unmount risk, uncertain host-path ownership, or filesystem corruption indicators requiring storage recovery.