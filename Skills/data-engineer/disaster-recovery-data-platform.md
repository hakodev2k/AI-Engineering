# Data Platform Disaster Recovery

## Purpose
Design and validate recovery of critical data services, metadata, pipeline state, and datasets after regional, platform, or operator failures.

## When to use
Use for critical data platforms, architecture reviews, cloud migrations, recovery planning, and after incidents reveal restoration gaps.

## Inputs
Critical assets, RPO/RTO, storage replication, backups, catalogs, orchestrator state, secrets, infrastructure code, and regional topology.

## Context to inspect
Inspect which components are reconstructable, backup frequency, replication mode, metadata dependencies, checkpoint locations, key management, DNS/network dependencies, and restore permissions.

## Core knowledge
Durable raw data alone is insufficient if catalogs, schemas, keys, orchestration state, or infrastructure cannot be reconstructed. Recovery objectives must be defined per business capability and tested.

## Procedure
1. Inventory critical platform components and data products.
2. Assign RPO and RTO based on business impact.
3. Classify components as replicated, backed up, or reconstructable.
4. Protect metadata, schemas, code, keys, and checkpoints.
5. Define alternate-region or clean-environment provisioning.
6. Document restore ordering and dependencies.
7. Make pipeline replay boundaries explicit.
8. Test restoration without relying on unavailable primary systems.
9. Reconcile recovered datasets.
10. Record measured recovery time and gaps.

## Decision points
Use cross-region replication when low RPO justifies cost and correlated failure risk is controlled; use backup-and-restore when longer recovery is acceptable and simplicity matters.

## Common failure patterns
Backups never restored, replication mistaken for backup, missing encryption keys, metadata stored only in the failed control plane, and recovery procedures dependent on individual memory.

## Verification
Run recovery exercises, measure actual RPO/RTO, validate restored access controls and data, and prove pipelines can resume without duplicate or skipped intervals.

## Expected output
A tested recovery plan with component dependencies, restoration sequence, measured objectives, and ownership.

## Stop conditions
Escalate when recovery objectives exceed platform capability or testing could materially disrupt production without approved isolation.