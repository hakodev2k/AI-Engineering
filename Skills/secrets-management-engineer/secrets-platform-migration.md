# Secrets Platform Migration

## Purpose
Move secrets, consumers, policies, and operational controls between secret-management platforms without silent access regressions, prolonged duplicate exposure, or unsafe cutover.

## When to use
Use when consolidating vaults, changing cloud providers, adopting a managed secrets service, or replacing legacy credential stores.

## Inputs
- Source and target platforms
- Secret inventory
- Consumer inventory
- Policy mappings
- Rotation and cutover constraints

## Context to inspect
Inspect secret paths, versions, metadata, ownership, policies, identities, dynamic-secret engines, certificates, rotation jobs, audit requirements, clients, SDKs, and disaster-recovery dependencies.

## Core knowledge
Migration is not a bulk copy. Platform semantics differ in authorization, versioning, leases, replication, metadata, encryption, APIs, and rotation. Senior migrations minimize coexistence and use rotation to prevent the source from remaining an authoritative backdoor.

## Procedure
1. Inventory source secrets, consumers, owners, and lifecycle controls.
2. Map source capabilities and policies to target equivalents.
3. Identify semantic gaps requiring application or operational changes.
4. Establish target identities, policies, audit, and resilience before data movement.
5. Migrate low-risk pilot workloads first.
6. Transfer or recreate secrets through approved protected mechanisms.
7. Prefer issuing new credentials rather than copying old values when feasible.
8. Update consumers incrementally and verify behavior.
9. Monitor source access to identify stragglers.
10. Rotate or revoke migrated credentials at the source.
11. Freeze, archive, or decommission the source according to policy.
12. Validate recovery and ownership on the target.

## Decision points
Use recreate-and-rotate when providers allow credential replacement; copy only when identity continuity requires it. Choose phased cutover for large dependency graphs, but bound dual-platform duration.

## Common failure patterns
- Migrating values without policies or ownership
- Keeping both platforms writable indefinitely
- Assuming path names imply equivalent authorization
- Forgetting dynamic credential engines
- Decommissioning source before identifying dormant consumers

## Verification
Verify target consumers, negative authorization tests, rotation, audit records, recovery, and zero unexpected source reads during the agreed observation window.

## Expected output
A completed migration with mapped controls, validated consumers, retired source credentials, and decommission evidence.

## Stop conditions
Stop if policy equivalence cannot be established, target recovery controls are incomplete, or unknown consumers still depend on source credentials.