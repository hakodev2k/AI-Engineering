# Backup and Disaster Recovery

## Purpose
Build and prove recovery for Kubernetes configuration, persistent data, and critical platform dependencies.
## When to use
DR planning, backup design, regional resilience, or recovery audits.
## Inputs
RPO/RTO, cluster architecture, data inventory, IaC/Git sources, backup systems, dependency map.
## Context to inspect
etcd responsibility, Git/IaC, PV backups/snapshots, external databases, secrets/KMS, DNS, identity, image registries, restore procedures.
## Core knowledge
A cluster can often be rebuilt from declarative sources, but state and external dependencies require independent recovery. Backup success is not restore success.
## Procedure
1. Classify critical state. 2. Map each asset to source of truth. 3. Define RPO/RTO. 4. Configure encrypted, isolated backups. 5. Capture dependencies needed for restore. 6. Build ordered recovery procedure. 7. Restore into isolated environment. 8. Measure recovery time and validate data/application integrity. 9. Correct gaps and repeat.
## Decision points
Prefer rebuild-from-code for replaceable cluster resources; back up irreplaceable state and metadata required to reconnect services.
## Common failure patterns
Backing up only manifests, snapshots in same failure domain, inaccessible KMS during disaster, no restore testing, and undocumented DNS/identity dependencies.
## Verification
Complete a timed restore exercise and validate data integrity, workload readiness, connectivity, identity, and SLO restoration.
## Expected output
Tested DR runbook with asset coverage, RPO/RTO evidence, owners, and gaps.
## Stop conditions
Do not claim DR readiness without a successful restore; escalate missing encryption keys or unrecoverable state immediately.