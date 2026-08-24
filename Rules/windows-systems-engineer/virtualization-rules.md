# Windows Virtualization

## Purpose
Operate Windows virtualization with controlled capacity, isolation, and recoverability.

## Scope
Hyper-V hosts, virtual machines, virtual switches, storage, checkpoints, migration, and guest integration.

## MUST
- Host and cluster capacity MUST preserve headroom for expected failures and maintenance.
- VM placement and migration MUST account for storage, network, licensing, affinity, and recovery requirements.
- Critical virtualization changes MUST preserve management access and rollback/recovery paths.
- Production VM deletion, destructive disk operations, or host-wide changes MUST require human approval.

## MUST NOT
- MUST NOT treat checkpoints as backups.
- MUST NOT oversubscribe critical resources without measured workload evidence and failure-capacity analysis.
- MUST NOT colocate redundant critical workloads in the same failure domain without explicit acceptance.

## SHOULD
- Standardize guest integration, time behavior, monitoring, and lifecycle configuration.
- Exercise host/cluster failure recovery.

## Exceptions
Require evidence, blast radius, compensating capacity/recovery, and approval.

## Verification
Review host/cluster health, resource utilization, placement, storage/network paths, backup coverage, failover tests, and representative guest health.