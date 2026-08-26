# Hot Key Management

## Purpose
Prevent disproportionate traffic to individual keys from creating latency or availability failures.

## Scope
Skewed access, celebrity keys, partitions, replicas, and local shielding.

## MUST
- Workloads MUST be evaluated for key-frequency skew, not only aggregate throughput.
- Known hot keys MUST have explicit capacity and failure handling.
- Partitioning schemes MUST account for hot-key concentration and node-level limits.
- Mitigations MUST preserve correctness and defined freshness bounds.

## MUST NOT
- Uniform key distribution MUST NOT be assumed without evidence.
- Replication or local caching MUST NOT bypass authorization or tenant isolation.
- Key splitting MUST NOT create incompatible values without a reconciliation model.

## SHOULD
- Detect emerging hot keys using sampled or privacy-safe frequency telemetry.
- Consider replication, hierarchical caching, request coalescing, or controlled key sharding based on measurements.

## Exceptions
Document observed skew, accepted saturation risk, fallback, and review owner.

## Verification
Use skewed-load tests and inspect per-key-class, partition, node, latency, saturation, and origin-request metrics.