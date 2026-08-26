# Source Database Decommissioning

## Purpose
Retire the source database safely after migration while preserving required recovery, audit, retention, and evidence obligations.

## When to use
Use only after migration acceptance and the agreed rollback/stabilization period.

## Inputs
Acceptance record, dependency telemetry, retention policy, legal holds, backup requirements, secrets, infrastructure inventory, licenses, and cost ownership.

## Core knowledge
Decommissioning is a controlled lifecycle stage. Premature deletion can destroy rollback options or regulated records; indefinite retention creates security and cost exposure.

## Procedure
1. Confirm formal migration acceptance and rollback-window expiry.
2. Verify no legitimate consumers connect to source.
3. Disable writes before deletion when a staged retirement is appropriate.
4. Capture final required backup/export and test readability.
5. Apply retention and legal-hold requirements.
6. Revoke credentials, network paths, replication, and temporary migration access.
7. Remove jobs, monitoring, licenses, and infrastructure in dependency-safe order.
8. Update inventories and operational documentation.
9. Confirm cost and security resources are released.
10. Preserve audit evidence of disposition.

## Decision points
Archive rather than delete when retention requires data but online database service is unnecessary. Keep source longer only with an explicit owner, expiry, and security controls.

## Common failure patterns
Deleting before acceptance, leaving snapshots indefinitely, orphaned credentials, forgotten replicas, and stale monitoring noise.

## Verification
Connection telemetry is empty, required archives are recoverable, access is revoked, assets are removed, and inventory reflects final state.

## Expected output
Auditable retirement with no orphaned consumers, secrets, or infrastructure.

## Stop conditions
Stop when legal retention, rollback obligations, or unidentified consumers remain unresolved.