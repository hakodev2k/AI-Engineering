# File Services and Permissions

## Purpose
Design and troubleshoot Windows file services with predictable access, least privilege, resilient sharing, and auditable ownership.

## When to use
Use for SMB shares, access failures, permission redesign, file-server migration, namespace changes, or privilege reviews.

## Inputs
Data owners, user/group model, share paths, NTFS ACLs, share permissions, inheritance, DFS design if used, availability and audit requirements.

## Preconditions
Identify data owner and preserve ACLs before migrations or bulk changes.

## Context to inspect
Share configuration, NTFS ACLs, inheritance, effective access, group nesting, SMB version/security, open files/sessions, quotas, DFS namespace/replication where applicable, and audit policy.

## Core knowledge
Effective SMB access combines share and NTFS permissions; deny ACEs and inheritance can make outcomes non-obvious. Prefer role-based groups over direct user ACLs. Preserve SIDs and ACL semantics during migration.

## Procedure
1. Establish data ownership and required access roles.
2. Inspect share and NTFS permissions separately.
3. Resolve nested group membership and effective access.
4. Identify inheritance boundaries and exceptional ACLs.
5. Design a group-based permission model with least privilege.
6. Stage changes on a limited path or representative identities.
7. Validate read/write/modify/admin scenarios explicitly.
8. For migrations, preserve metadata, ACLs, timestamps, and ownership as required.
9. Monitor SMB errors, capacity, and audit events.
10. Document ownership and access-request process.

## Decision points
Use broad share permissions with precise NTFS ACLs only when organizational standards support that model. Use DFS namespaces when location abstraction and availability justify added complexity.

## Common failure patterns
Direct user permissions, excessive deny ACEs, broken inheritance without documentation, granting Full Control to solve tickets, copying data without ACLs, and testing only with privileged accounts.

## Verification
Check effective access for representative users, SMB connectivity, file operations, auditing, backup, and application paths.

## Expected output
An explainable permission model and verified file-service behavior.

## Stop conditions
Stop when data ownership is unknown, bulk ACL changes lack rollback, regulated data requires security approval, or migration cannot preserve required metadata.