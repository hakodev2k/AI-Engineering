# Storage Throughput Rules

## Purpose
Ensure AI workloads receive reliable, scalable storage throughput without compromising integrity.

## Scope
Applies to datasets, checkpoints, object storage, parallel filesystems, local caches, and data staging.

## MUST
- Storage design MUST be sized using measured read/write throughput, IOPS, metadata rate, and concurrency.
- Critical datasets and checkpoints MUST have durability and recovery objectives.
- Data staging MUST preserve integrity checks across transfers.
- Shared storage saturation MUST be observable and alertable.

## MUST NOT
- MUST NOT assume benchmark throughput from single-client tests represents distributed workload behavior.
- MUST NOT place irreplaceable artifacts only on ephemeral node-local storage.
- MUST NOT bypass integrity validation to reduce staging time.

## SHOULD
- Hot data SHOULD be cached near compute when consistency requirements permit.
- Storage tiers SHOULD align performance, durability, and cost with workload criticality.

## Exceptions
Exceptions require measured evidence, data-loss analysis, recovery plan, and approval.

## Verification
Review storage benchmarks, saturation metrics, replication settings, checksum validation, cache behavior, and restore tests.