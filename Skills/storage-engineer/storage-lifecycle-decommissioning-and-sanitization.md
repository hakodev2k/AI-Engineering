# Storage Lifecycle, Decommissioning, and Sanitization

## Purpose
Retire storage resources safely by proving data ownership, retention compliance, dependency removal, recoverability, and appropriate sanitization.

## When to use
Use for hardware retirement, volume/bucket deletion, platform migration completion, tenant offboarding, or media disposal.

## Inputs
Asset/resource inventory, owners, data classification, retention/legal holds, dependency map, migration evidence, backup policy, encryption state, and sanitization requirements.

## Context to inspect
Mounts, API consumers, replicas, snapshots, backups, DNS/config references, monitoring, IAM, billing, CMDB/inventory, and key management.

## Core knowledge
Deletion is not equivalent to sanitization. SSDs, arrays, object stores, snapshots, and replicated systems have different erasure semantics. Cryptographic erasure can be effective when keys and encryption boundaries are correctly designed.

## Procedure
1. Confirm authoritative owner and decommission approval.
2. Check retention, legal hold, and regulatory obligations.
3. Verify workloads migrated and acceptance criteria passed.
4. Search for remaining clients and dependencies.
5. Establish rollback/recovery window where appropriate.
6. Remove access and observe for unexpected demand.
7. Delete replicas/snapshots according to approved scope.
8. Sanitize media/data using policy-appropriate method.
9. Revoke/destroy keys when cryptographic erasure is used.
10. Update inventory, monitoring, billing, and documentation.
11. Preserve audit evidence of disposition.

## Decision points
Use staged disable-before-delete for uncertain dependencies; choose overwrite, secure erase, physical destruction, or cryptographic erasure according to medium and policy. Do not sanitize backups still required by retention.

## Common failure patterns
Deleting before dependency checks, forgotten snapshots, untracked removable media, invalid SSD overwrite assumptions, and destroying keys needed for retained backups.

## Verification
Confirm no active clients, required data exists at destination, deletion/sanitization completed across copies, access is revoked, and asset records are closed.

## Expected output
Decommission checklist evidence, sanitization record, dependency closure, and updated inventory.

## Stop conditions
Stop on unknown ownership, legal hold, incomplete migration validation, ambiguous copy scope, or missing sanitization authority.