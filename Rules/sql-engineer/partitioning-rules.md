# Partitioning Rules

## Purpose
Use partitioning for lifecycle, scale, and access-path needs without creating hidden complexity.

## Scope
Table/index partitioning, partition keys, pruning, switching, retention, and repartitioning.

## MUST
- Partitioning MUST solve a defined workload or lifecycle problem supported by scale evidence.
- Partition keys MUST align with access, retention, uniqueness, and distribution requirements.
- Operations MUST account for partition pruning behavior and global/local index implications.
- Retention or partition-drop procedures MUST protect legal and business retention obligations.

## MUST NOT
- MUST NOT introduce partitioning as a generic performance fix without measurements.
- MUST NOT assume predicates prune partitions without verifying execution plans.
- MUST NOT perform destructive partition maintenance in production without authorization and validation of the targeted boundary.

## SHOULD
- Prefer stable keys that avoid frequent row movement.
- Automate future partition provisioning when missing partitions can cause outages.

## Exceptions
Complex repartitioning requires migration design, capacity evidence, rollback/recovery, and approval.

## Verification
Inspect plans for pruning, test boundary values, measure representative queries and writes, validate partition metadata, and rehearse retention/switch operations safely.