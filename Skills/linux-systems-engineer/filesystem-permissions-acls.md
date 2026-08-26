# Filesystem Permissions and ACLs

## Purpose
Design and troubleshoot Linux filesystem access with predictable ownership, permissions, ACL inheritance, and service behavior.

## When to use
Use for access-denied errors, shared directories, service data paths, deployment ownership, or permission hardening.

## Inputs
Required actors/actions, path tree, filesystem/mount options, current ownership/modes/ACLs, and deployment process.

## Context to inspect
Inspect every parent directory, symlinks, mount boundaries, UID/GID mapping, umask, default ACLs, setgid directories, capabilities, and MAC policy.

## Core knowledge
Path traversal requires execute permission on directories; file access combines owner/group/other modes, ACL masks, identity groups, mount options, and possibly MAC controls.

## Procedure
1. Identify the exact effective user/group of the failing process.
2. Trace permissions across every path component.
3. Inspect ACLs, masks, default ACLs, and mount options.
4. Determine desired ownership model for future files.
5. Prefer stable groups and setgid/default ACLs for shared trees.
6. Avoid recursive changes until exceptional paths are understood.
7. Test creation, read, write, rename, delete, and traversal as actual identities.
8. Ensure deployment/backup tools preserve intended metadata.

## Decision points
Use classic modes for simple ownership; ACLs for justified multi-principal access. Avoid 777 as a diagnostic or permanent solution.

## Common failure patterns
Testing as root, recursive chmod/chown, forgetting ACL mask, missing execute on parent directories, UID mismatch on network/container mounts, and umask defeating collaboration.

## Verification
Positive and negative access tests pass, newly created files inherit correctly, services restart successfully, and policy survives deployment/reboot.

## Expected output
Minimal maintainable permission model with tested inheritance.

## Stop conditions
Stop before recursive metadata changes on large/stateful trees without backup, scope validation, and owner approval.