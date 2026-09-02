# Storage Efficiency Rules

## Purpose
Minimize unnecessary storage capacity and I/O while preserving durability, correctness, recoverability, and required access performance.

## Scope
Applies to object storage, block storage, databases, file systems, caches, artifacts, logs, and backups.

## MUST
- Storage design MUST distinguish hot, warm, archival, ephemeral, and recovery data according to actual access and durability requirements.
- Compression, compaction, deduplication, tiering, and retention choices MUST be evaluated against CPU cost, latency, recoverability, and operational complexity.
- Large persistent datasets MUST have monitored growth and capacity forecasts.

## MUST NOT
- MUST NOT replicate or retain data solely because storage appears inexpensive.
- MUST NOT reduce replication or durability below required recovery and availability targets for sustainability reasons.
- MUST NOT apply compression or compaction that creates unacceptable compute, latency, or recovery costs without evidence.

## SHOULD
- Prefer lifecycle tiering for infrequently accessed data.
- Remove abandoned artifacts and orphaned volumes through controlled automation.
- Select formats and schemas that avoid material storage amplification when practical.

## Exceptions
Exceptions require documented durability, latency, compatibility, or recovery constraints plus periodic reassessment.

## Verification
Review storage inventories, utilization and growth trends, lifecycle configuration, replication settings, compression ratios, access patterns, backup requirements, and restore evidence.
