# I/O and Storage Performance Rules
## Purpose
Identify and control storage-path bottlenecks affecting database latency and throughput.
## Scope
Data files, logs, disks, volumes, storage tiers, IOPS, throughput, and queueing.
## MUST
- Measure latency, throughput, IOPS, queue depth, and saturation before attributing slowness to storage.
- Distinguish data-read, data-write, log-write, checkpoint, and maintenance I/O where possible.
- Validate storage changes against durability and recovery requirements.
## MUST NOT
- Recommend faster storage without demonstrating storage is a limiting resource.
- Trade durability guarantees for performance without explicit risk approval.
## SHOULD
- Maintain headroom for peak and recovery workloads.
## Exceptions
Emergency capacity expansion may precede complete analysis when saturation threatens availability.
## Verification
Inspect storage telemetry, database file statistics, wait data, host metrics, durability configuration, and before/after tests.