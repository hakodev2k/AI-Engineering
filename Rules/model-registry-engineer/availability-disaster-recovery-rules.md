# Availability and Disaster Recovery Rules

## Purpose
Ensure critical registry metadata and model artifacts remain recoverable during infrastructure failures and regional incidents.

## Scope
Replication, backups, metadata databases, artifact stores, failover, restore, RPO, RTO, and recovery drills.

## MUST
- Critical registry services MUST define recovery point and recovery time objectives.
- Registry metadata and non-regenerable artifacts MUST have tested backup or replication strategies.
- Recovery procedures MUST preserve artifact-version identity, lineage, permissions, and audit history.
- Restore tests MUST validate representative model resolution and artifact retrieval, not only storage restoration.
- Recovery dependencies such as keys, identities, and configuration MUST be included in disaster-recovery planning.

## MUST NOT
- MUST NOT declare a backup strategy sufficient without restore evidence.
- MUST NOT restore metadata that points to missing or mismatched artifact content.
- MUST NOT bypass authorization controls as a normal failover mechanism.

## SHOULD
- Automate consistency checks after restoration.
- Exercise recovery for production-critical registries periodically.

## Exceptions
Reduced recovery coverage requires documented scope, impact, duration, and approval.

## Verification
Inspect backup reports, restore drills, checksum reconciliation, failover tests, and measured RPO/RTO evidence.