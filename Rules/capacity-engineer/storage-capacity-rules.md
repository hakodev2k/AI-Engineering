# Storage Capacity

## Purpose
Prevent data-growth and I/O saturation from causing outages, corruption risk, or unsafe maintenance windows.

## Scope
Applies to block, file, object, database-attached, and ephemeral storage where capacity affects service operation.

## MUST
- Storage planning MUST track usable space, growth rate, IOPS, throughput, latency, retention, replication, and maintenance overhead when applicable.
- Alerting thresholds MUST leave enough time to expand, migrate, compact, or delete data safely.
- Capacity models MUST include temporary space required by backups, compaction, rebuilds, migrations, and failover.
- Expansion plans MUST consider platform-specific scaling limits and lead time.

## MUST NOT
- MUST NOT plan only for nominal stored bytes when metadata, replicas, snapshots, or indexes materially increase consumption.
- MUST NOT use emergency deletion as the normal mechanism for staying within capacity.
- MUST NOT assume provisioned storage throughput is available under all failure or shared-resource conditions.

## SHOULD
- Separate logical data growth from physical amplification.
- Review retention policy and data lifecycle before buying capacity solely to preserve unnecessary data.

## Exceptions
Exceptions require documented risk, time bound, recovery path, and approval for production-critical storage.

## Verification
Inspect growth trends, filesystem or service limits, I/O metrics, snapshot and backup overhead, retention settings, and expansion tests.
