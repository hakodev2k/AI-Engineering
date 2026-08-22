# Backup and Disaster Recovery Rules
## Purpose
Ensure recoverability from deletion, corruption, outage, and disaster.
## Scope
Backups, restore procedures, replication, failover, recovery objectives, and disaster exercises.
## MUST
- Critical data and services MUST have documented RPO and RTO approved by accountable owners.
- Backups MUST be monitored and restoration MUST be tested at a frequency proportional to risk.
- Disaster recovery procedures MUST identify dependencies, sequencing, authority, and validation criteria.
## MUST NOT
- MUST NOT treat successful backup jobs as proof of recoverability without restore evidence.
- MUST NOT perform destructive recovery tests against production without explicit approval.
## SHOULD
- Automate recovery validation where practical.
## Exceptions
Exceptions require accepted recovery risk, evidence, compensating controls, and approval.
## Verification
Inspect backup policies, restore-test results, recovery exercises, replication health, runbooks, and recovery metrics.