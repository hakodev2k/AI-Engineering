# Identity, Permissions, and sudo

## Purpose
Engineer safe Linux account, group, filesystem permission, and administrative delegation models.

## When to use
Use for access provisioning, permission failures, sudo policy changes, service identities, or privilege reviews.

## Inputs
Required actions, users/services, resources, authentication source, ownership model, and audit requirements.

## Context to inspect
Inspect NSS/PAM sources, UID/GID mapping, groups, ACLs, ownership, umask, sudoers/includes, capabilities, service accounts, and automation identities.

## Core knowledge
Understand DAC, ACLs, setuid/setgid/sticky bits, Linux capabilities, sudo command matching, identity resolution, least privilege, and separation of human/service identities.

## Procedure
1. Translate business need into exact resource/action permissions.
2. Identify current identity and group resolution.
3. Inspect effective permissions across every path component.
4. Prefer group/ACL/capability delegation over broad ownership or root access.
5. Scope sudo to necessary commands and arguments where practical.
6. Separate service from human identities.
7. Test positive and negative access cases.
8. Ensure changes are auditable and reversible.

## Decision points
Use ACLs for exceptional per-resource grants; groups for stable shared roles; capabilities only when they safely replace full root privilege; sudo only for administrative actions.

## Common failure patterns
chmod 777, recursive ownership changes without analysis, broad NOPASSWD ALL, UID mismatches, stale groups, and permission tests performed as root.

## Verification
Confirm intended access succeeds, prohibited access fails, sudo logs are generated, service startup still works, and permissions survive deployment/reboot mechanisms.

## Expected output
Minimal permission model, tested policy, and audit evidence.

## Stop conditions
Stop when identity ownership is ambiguous, directory-service changes require another authority, or access changes could remove emergency administration.