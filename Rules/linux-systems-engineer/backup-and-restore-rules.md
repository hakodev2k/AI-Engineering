# Backup and Restore Rules

## Purpose
Ensure required host and system data can be recovered within defined loss and recovery objectives.

## Scope
Applies to host configuration, local persistent data, backup agents, snapshots, encryption, retention, and restore procedures.

## MUST
- Backup scope MUST be derived from data ownership, rebuildability, RPO, RTO, and dependency requirements.
- Backups MUST have monitored success/failure status and protected credentials.
- Recovery procedures MUST be tested using actual restores, not inferred from backup-job success.
- Backup copies containing sensitive data MUST be protected with access controls and encryption appropriate to their sensitivity.
- Restore tests MUST verify data usability and required metadata such as ownership and permissions.

## MUST NOT
- Snapshots, RAID, or replicas MUST NOT be called backups unless they satisfy independent recovery requirements.
- Failed or stale backups MUST NOT remain silently outside operational alerting.
- Destructive recovery tests MUST NOT run against production data without explicit approval and isolation controls.

## SHOULD
- Maintain independent failure domains for critical backups.
- Automate restore validation where practical.
- Document dependencies required to rebuild a host from bare infrastructure.

## Exceptions
Data intentionally excluded from backup requires documented rebuild strategy, accepted loss impact, owner, and review.

## Verification
Review backup inventory, age, job failures, retention, encryption and access policies; perform sampled restores; compare results to RPO/RTO; and verify recovered services can consume restored data.