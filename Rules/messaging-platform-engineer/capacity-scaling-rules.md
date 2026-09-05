# Capacity and Scaling Rules

## Purpose
Keep messaging capacity ahead of traffic growth while avoiding unsafe scaling assumptions.

## Scope
Partitions, brokers, replicas, storage, network, consumers, quotas, and throughput planning.

## MUST
- Capacity plans MUST use measured ingress, egress, retention, message size, replication, and consumer throughput.
- Partition or shard growth MUST consider ordering, key distribution, and rebalance impact.
- Headroom MUST account for planned maintenance and required failure tolerance.
- Scaling thresholds MUST be tied to observable saturation indicators.

## MUST NOT
- MUST NOT size only for average traffic.
- MUST NOT add partitions without assessing key distribution and consumer compatibility.
- MUST NOT assume broker scaling automatically removes downstream bottlenecks.

## SHOULD
- Maintain forecasts and load tests for peak and failover scenarios.

## Exceptions
Operating below required headroom requires documented duration, risk, mitigation, and approval.

## Verification
Review capacity models, load tests, partition distribution, storage growth, and saturation dashboards.