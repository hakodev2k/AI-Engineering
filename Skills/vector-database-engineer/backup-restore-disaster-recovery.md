# Backup, Restore, and Disaster Recovery

## Purpose
Protect vector data, metadata, configuration, and indexes from corruption, deletion, and regional failure with tested recovery.

## When to use
Use when establishing DR, changing backup topology, or validating recovery readiness.

## Inputs
RPO/RTO, source reproducibility, database backup features, storage policies, encryption, topology, and compliance requirements.

## Context to inspect
Inspect snapshots, WAL/log backups, object storage, encryption keys, source-of-truth availability, index rebuild duration, restore automation, and previous drills.

## Core knowledge
Vectors may be reproducible, but regeneration can be slower or costlier than restore. Backups must include enough metadata/configuration to restore query semantics. A backup is unproven until restored and validated.

## Procedure
1. Classify which data is authoritative versus derived/rebuildable.
2. Define RPO/RTO for each component.
3. Select snapshot/log/rebuild strategy accordingly.
4. Store backups in independent failure domains with encryption and retention.
5. Capture schema, index configuration, model/version provenance, and access configuration.
6. Automate restore into an isolated environment.
7. Validate counts, checksums/revisions, index readiness, and sample retrieval.
8. Measure full recovery duration including index rebuild/warm-up.
9. Run scheduled disaster exercises and record gaps.
10. Test backup deletion/retention controls.

## Decision points
Rebuild vectors from source when source is durable and recovery time/cost fits RTO; restore snapshots when regeneration exceeds acceptable outage/cost. Maintain cross-region copies for regional failure requirements.

## Common failure patterns
Backing up vectors but not metadata; encryption key unavailable during DR; snapshots in same failure domain; restore never tested; ignoring index rebuild time; retention violating deletion policy.

## Verification
Perform a clean-room restore, compare source revisions/counts, execute retrieval tests, and prove measured RPO/RTO.

## Expected output
A tested backup/restore design and DR runbook with recovery evidence.

## Stop conditions
Stop if recovery requires unavailable keys/permissions or destructive DR actions lack approval.