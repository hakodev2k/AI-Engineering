# Data Retention and Lifecycle

## Purpose
Control how long data and intermediate artifacts are retained so storage, compliance, recovery, and consumer needs remain balanced.

## When to use
Use for new datasets, rapidly growing storage, sensitive data, backup design, raw zones, logs, checkpoints, and temporary processing artifacts.

## Inputs
Business retention needs, legal policy, recovery windows, source replay capability, storage tiers, consumer dependencies, and cost.

## Context to inspect
Inspect copies across environments, snapshots, backups, derived datasets, object versions, temp files, checkpoint state, and deletion propagation.

## Core knowledge
Retention is an end-to-end property. Deleting a curated table is insufficient if raw copies, backups, exports, or derived data remain. Recovery requirements can conflict with deletion obligations and require explicit policy.

## Procedure
1. Inventory authoritative and derived copies.
2. Classify each asset by purpose and sensitivity.
3. Define minimum and maximum retention.
4. Identify recovery and replay dependencies.
5. Configure lifecycle transitions and expiration.
6. Define deletion propagation for regulated subjects where applicable.
7. Protect checkpoints and metadata needed for correctness.
8. Test expiration without breaking active pipelines.
9. Monitor orphaned and unclassified storage.
10. Review policies as consumer needs change.

## Decision points
Keep raw history when it materially improves audit/reprocessing and policy permits it; otherwise minimize retention. Move cold data to cheaper tiers when retrieval latency is acceptable.

## Common failure patterns
Infinite retention by default, deleting only primary copies, lifecycle rules removing active checkpoints, backups exempt from all policy without rationale, and no owner for orphaned datasets.

## Verification
Inspect configured policies, simulate expiration on noncritical data, trace deletion across copies, and compare storage growth before and after lifecycle controls.

## Expected output
An enforceable lifecycle map covering active, cold, backup, temporary, and derived data.

## Stop conditions
Escalate when legal retention and deletion requirements conflict or recovery objectives cannot be met under proposed retention.