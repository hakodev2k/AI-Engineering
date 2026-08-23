# Storage and Data Safety Rules
## Purpose
Protect persistent workload data from loss, corruption, and unsafe lifecycle changes.
## Scope
PersistentVolumes, claims, StorageClasses, snapshots, reclaim policies, and stateful workloads.
## MUST
- Match storage class, durability, performance, topology, encryption, and reclaim behavior to workload requirements.
- Define backup and restore responsibilities for persistent production data.
- Test restoration for data whose loss exceeds accepted recovery objectives.
- Review volume deletion, migration, expansion, and storage-class changes for data-loss risk.
## MUST NOT
- Assume a PersistentVolume is a backup.
- Delete or recreate production claims containing durable data without approved recovery evidence.
## SHOULD
- Prefer CSI capabilities and documented platform storage patterns.
## Exceptions
Ephemeral or reproducible data may omit backup when explicitly classified as such.
## Verification
Inspect storage resources, reclaim policies, snapshots/backups, restore tests, encryption, and failure events.